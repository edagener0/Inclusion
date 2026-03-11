from django.urls import path
from .views import (
    DMConversationMessagesView,
    DMListCreateView,
)

urlpatterns = [
    path("", DMListCreateView.as_view(), name="dm-create-list"),
    path("/<int:user_id>/messages", DMConversationMessagesView.as_view(), name="dm-conversation-messages"),
]
