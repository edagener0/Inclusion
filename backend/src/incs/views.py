from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from .serializers import IncSerializer
from .models import Inc


class IncCreateListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IncSerializer
    queryset = Inc.objects.all().order_by("id")

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

class IncRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = IncSerializer
    queryset = Inc.objects.all()