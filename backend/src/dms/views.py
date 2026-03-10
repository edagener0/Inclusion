from django.shortcuts import render
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.permissions import IsOwnerOrReadOnly
from django.db.models import Q
from .models import DM
from .serializers import DMSerializer, DMCreateSerializer, DMListSerializer

class DMListView(ListCreateAPIView):
    serializer_class = DMListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return DM.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user) #union
        ).order_by("-created_at")
    
class DMRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = DM.objects.all()
    lookup_url_kwarg = "dm_id"
    lookup_field = "id"