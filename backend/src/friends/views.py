from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
)
from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    FriendRequestCreateDestroySerializer,
    FriendRequestReceivedListRetrieveSerializer,
    FriendRequestSentListRetrieveSerializer,
    FriendListSerializer,
)
from .models import FriendRequest, Friend
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from common.serializers import DetailResponseSerializer
from django.db.models import Q, Exists, OuterRef

User = get_user_model()


@extend_schema(
    tags=["Friends"],
    summary="Send friend request",
    description="Create a new friend request from the authenticated user to another user.",
)
class FriendRequestCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestCreateDestroySerializer

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)


@extend_schema(
    tags=["Friends"],
    summary="List received requests",
    description="List the friend requests received by the authenticated user.",
)
class FriendRequestListReceivedView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestReceivedListRetrieveSerializer
    queryset = FriendRequest.objects.none()

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user).order_by(
            "created_at"
        )


@extend_schema(
    tags=["Friends"],
    summary="List sent requests",
    description="List the friend requests sent by the authenticated user.",
)
class FriendRequestListSentView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSentListRetrieveSerializer
    queryset = FriendRequest.objects.none()

    def get_queryset(self):
        return FriendRequest.objects.filter(from_user=self.request.user).order_by(
            "created_at"
        )


@extend_schema(
    tags=["Friends"],
    summary="Get received request",
    description="Retrieve a received friend request by the sender's user id.",
)
class FriendRequestRetrieveReceivedView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestReceivedListRetrieveSerializer
    queryset = FriendRequest.objects.none()
    lookup_field = "from_user_id"
    lookup_url_kwarg = "from_user_id"

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user)


@extend_schema_view(
    get=extend_schema(
        tags=["Friends"],
        summary="Get sent request",
        description="Retrieve a friend request sent by the authenticated user.",
    ),
    delete=extend_schema(
        tags=["Friends"],
        summary="Cancel sent request",
        description="Delete a friend request previously sent by the authenticated user.",
        responses={204: OpenApiResponse(description="Friend request cancelled.")},
    ),
)
class FriendRequestRetrieveDestroySentView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestCreateDestroySerializer
    queryset = FriendRequest.objects.none()
    lookup_field = "to_user_id"
    lookup_url_kwarg = "to_user_id"

    def get_queryset(self):
        return FriendRequest.objects.filter(from_user=self.request.user)


class FriendRequestAcceptReceivedView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            201: DetailResponseSerializer,
            404: DetailResponseSerializer,
        },
        tags=["Friends"],
        summary="Accept friend request",
        description="Accept a received friend request and create the friendship.",
    )
    def post(self, request, from_user_id):

        friend_request = get_object_or_404(
            FriendRequest, from_user_id=from_user_id, to_user_id=self.request.user.id
        )

        Friend.objects.create(
            user1_id=from_user_id,
            user2_id=self.request.user.id,
        )

        # if i send a friend request and someone sends me a friend request and I accept that friend request
        # the other friend request stays forever in our database. This fixes this, deleting in both 'directions of friendship'
        FriendRequest.objects.filter(
            Q(from_user_id=from_user_id, to_user_id=self.request.user.id)
            | Q(from_user_id=self.request.user.id, to_user_id=from_user_id)
        ).delete()

        return Response(
            {"detail": "Accepted the friend request!"}, status=status.HTTP_201_CREATED
        )


class FriendRequestDeclineReceivedView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            204: OpenApiResponse(description="Friend request declined."),
            404: DetailResponseSerializer,
        },
        tags=["Friends"],
        summary="Decline friend request",
        description="Decline a received friend request.",
    )
    def delete(self, request, from_user_id):

        friend_request = get_object_or_404(
            FriendRequest, from_user_id=from_user_id, to_user_id=self.request.user.id
        )

        friend_request.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class FriendRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            204: OpenApiResponse(description="Friend removed."),
            404: DetailResponseSerializer,
        },
        tags=["Friends"],
        summary="Remove friend",
        description="Remove an existing friendship.",
    )
    def delete(self, request, friend_id):
        friendship = get_object_or_404(
            Friend,
            Q(user1=request.user, user2_id=friend_id)
            | Q(user2=request.user, user1_id=friend_id),
        )

        friendship.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    tags=["Friends"],
    summary="List friends",
    description="List the friends for the selected username, annotated with friendship state relative to the authenticated user.",
)
class FriendListView(ListAPIView):
    serializer_class = FriendListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return User.objects.none()

        username = self.kwargs["username"]
        user = get_object_or_404(
            User,
            username=username,
        )

        request_user = self.request.user

        is_friend_subquery = Friend.objects.filter(
            Q(user1=request_user, user2=OuterRef("pk"))
            | Q(user1=OuterRef("pk"), user2=request_user)
        )

        return user.friends.annotate(is_friend=Exists(is_friend_subquery))
