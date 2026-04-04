from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
)
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
from common.serializers import ProfileFeedSerializer
from django.db.models import Q, Exists, OuterRef

User = get_user_model()


class FriendRequestCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestCreateDestroySerializer

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)


class FriendRequestListReceivedView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestReceivedListRetrieveSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user).order_by(
            "created_at"
        )


class FriendRequestListSentView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSentListRetrieveSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(from_user=self.request.user).order_by(
            "created_at"
        )


class FriendRequestRetrieveReceivedView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestReceivedListRetrieveSerializer
    lookup_field = "from_user_id"
    lookup_url_kwarg = "from_user_id"

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user)


class FriendRequestRetrieveDestroySentView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestCreateDestroySerializer
    lookup_field = "to_user_id"
    lookup_url_kwarg = "to_user_id"

    def get_queryset(self):
        return FriendRequest.objects.filter(from_user=self.request.user)


class FriendRequestAcceptReceivedView(APIView):
    permission_classes = [IsAuthenticated]

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

    def delete(self, request, from_user_id):

        friend_request = get_object_or_404(
            FriendRequest, from_user_id=from_user_id, to_user_id=self.request.user.id
        )

        friend_request.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class FriendRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, friend_id):
        friendship = get_object_or_404(
            Friend,
            Q(user1=request.user, user2_id=friend_id)
            | Q(user2=request.user, user1_id=friend_id),
        )

        friendship.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


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
