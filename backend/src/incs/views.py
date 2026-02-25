from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import IncSerializer
from .models import Inc
from content.utils import (
    create_like_for_content,
    remove_like_from_content
)

class IncCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IncSerializer
    queryset = Inc.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class IncRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = IncSerializer
    queryset = Inc.objects.all()
    lookup_url_kwarg = "inc_id"
    lookup_field = "id"


class IncLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, inc_id):
        return create_like_for_content(request, inc_id)

    def delete(self, request, inc_id):
        return remove_like_from_content(request, inc_id)