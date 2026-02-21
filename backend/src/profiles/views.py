from drf_spectacular.utils import (
    extend_schema,
)
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .filters import ProfileFilter

User = get_user_model()

@extend_schema(
    tags=["Profiles"],
    description="Get a user's profile."
)
class ProfileRetrieveView(RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    lookup_field = "username"
    lookup_url_kwarg = "username"
    

@extend_schema(
    tags=["Profiles"],
    description="Returns a list of paginated users' profiles."
)
class ProfileListView(ListAPIView):
    queryset = User.objects.all().order_by("first_name")
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ProfileFilter