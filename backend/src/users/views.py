from rest_framework.generics import (
    RetrieveUpdateAPIView
)
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
)
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import (
    extend_schema, 
)

User = get_user_model()

@extend_schema(
    tags=["Users"],
)
class UserRetrieveUpdateView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "options", "head"]

    def get_object(self):
        return self.request.user

