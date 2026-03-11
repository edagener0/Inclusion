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

# DMListView: Listar apenas as DM que o usuario tem com outros recivers, mostrando o username do remetente e destinatário, e para criar uma nova mensagem DM, onde o remetente é o usuário autenticado
class DMListView(ListCreateAPIView):
    serializer_class = DMListSerializer
    permission_classes = [IsAuthenticated]
    def get_serializer_class(self):
        if self.request.method == "POST":
            return DMCreateSerializer
        return DMListSerializer
    
    def get_queryset(self):
        return DM.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user) #union
        ).order_by("-created_at")



# DMListMessageView: Listar as mensagens dentro do DM do usuário autenticado com um determinado receiver, mostrando o username do remetente e destinatário, e para criar uma nova mensagem DM, onde o remetente é o usuário autenticado
class DMListMessageView(ListCreateAPIView):
    serializer_class = DMSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        receiver_id = self.kwargs.get("receiver_id")
        return DM.objects.filter(
            (Q(sender=self.request.user) & Q(receiver__id=receiver_id)) | 
            (Q(sender__id=receiver_id) & Q(receiver=self.request.user))
        ).order_by("-created_at")


class DMRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = DM.objects.all()
    lookup_url_kwarg = "dm_id"
    lookup_field = "id"