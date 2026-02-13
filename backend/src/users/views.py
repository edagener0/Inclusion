from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)
from django.contrib.auth import get_user_model
from .serializers import (
    UserListSerializer,
    UserDetailSerializer,
)

User = get_user_model()

class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer

class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer