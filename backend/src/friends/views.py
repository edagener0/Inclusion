from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    FriendRequestCreateDestroySerializer,
    FriendRequestListRetrieveSerializer
)
from .models import (
    FriendRequest,
    Friend
)

class FriendRequestCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestCreateDestroySerializer

    def perform_create(self, serializer):
        serializer.save(from_user = self.request.user)

class FriendRequestListReceivedView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestListRetrieveSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(
            to_user = self.request.user
        )

class FriendRequestListSentView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestListRetrieveSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(
            from_user = self.request.user
        )

class FriendRequestRetrieveReceivedView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestListRetrieveSerializer
    lookup_field = "from_user_id"
    lookup_url_kwarg = "from_user_id"

    def get_queryset(self):
        return FriendRequest.objects.filter(
            to_user = self.request.user
        )


class FriendRequestRetrieveDestroySentView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestCreateDestroySerializer
    lookup_field = "to_user_id"
    lookup_url_kwarg = "to_user_id"

    def get_queryset(self):
        return FriendRequest.objects.filter(
            from_user = self.request.user
        )

