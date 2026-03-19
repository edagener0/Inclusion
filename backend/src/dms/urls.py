from django.urls import path
from .views import (
    DMConversationMessagesView,
    DMListCreateView,
    DMRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("", DMListCreateView.as_view(), name="dm-create-list"),
    path("/<int:user_id>/messages", DMConversationMessagesView.as_view(), name="dm-conversation-messages"),
    path("/messages/<int:dm_id>", DMRetrieveUpdateDestroyView.as_view(), name="dm-message-retrieve-update-destroy"),
]
