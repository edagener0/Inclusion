from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import (
    UserListSerializer,
    UserDetailUpdateSerializer,
)
from rest_framework.permissions import IsAuthenticated
from .filters import UserFilter
from django.db.models import Q, Value
from django.db.models.functions import Concat
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import (
    extend_schema, 
    OpenApiParameter,
    OpenApiResponse
)
from drf_spectacular.types import OpenApiTypes
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser


User = get_user_model()


@extend_schema(
    tags=["Users"],
    description="Returns a list of paginated users."
)
class UserListView(ListAPIView):
    queryset = User.objects.all().order_by("first_name")
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = UserFilter


@extend_schema(
        tags=["Users"],
        description="You may update a user.",
        request = UserDetailUpdateSerializer(partial=True),
        responses={
            200: OpenApiResponse(description="Update successful"),
            400: OpenApiResponse(description="You may only edit your own profile")
        }
)
class UserUpdateView(UpdateAPIView):
    serializer_class = UserDetailUpdateSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "options", "head"]

    def get_object(self):
        return self.request.user

@extend_schema(
    tags=["Users"],
    description="You may get details on a user",
    request = UserDetailUpdateSerializer(),
    responses={
        200: OpenApiResponse(description="Got the user details successfully!"),
    }
)
class UserRetrieveView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailUpdateSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(
    tags=["Users"],
    description="Search for a user based on his username, first name, last name and full name."
)
class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserListSerializer
    pagination_class = PageNumberPagination

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="page",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="The page number for the users.",
            )
        ],
        responses={status.HTTP_200_OK: UserListSerializer(many=True)}
    )
    def get(self, request, name):
        users = User.objects.annotate(
            full_name = Concat(
                "first_name",
                Value(" "),
                "last_name"
            )
        ).filter(
            Q(username__icontains = name) |
            Q(first_name__icontains = name) |
            Q(last_name__icontains = name) |
            Q(full_name__icontains = name)
        ).order_by("first_name")
        
        paginator = self.pagination_class()
        
        page = paginator.paginate_queryset(
            users, request, view=self
        )

        serializer = self.serializer_class(page, many=True)

        return paginator.get_paginated_response(serializer.data)