from rest_framework.generics import (
    ListAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import (
    UserListSerializer,
    UserDetailUpdateSerializer
)
from rest_framework.permissions import IsAuthenticated
from .filters import UserFilter
from django.db.models import Q, Value
from django.db.models.functions import Concat
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import (
    extend_schema, 
    OpenApiParameter
)
from drf_spectacular.types import OpenApiTypes
from rest_framework import status
User = get_user_model()

class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = UserFilter

class UserDetailUpdateView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailUpdateSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "options", "head"]

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
        )
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(
            users, request, view=self
        )

        serializer = self.serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)