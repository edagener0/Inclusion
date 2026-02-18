from rest_framework.generics import (
    ListAPIView,
    RetrieveUpdateAPIView
)
from django.contrib.auth import get_user_model
from .serializers import (
    UserListSerializer,
    UserDetailUpdateSerializer
)
from rest_framework.permissions import IsAuthenticated
from .filters import UserFilter

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
