from django.urls import path
from .views import (
    DMConversationMessagesView,
    DMListView,
    DMRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("", DMListView.as_view(), name="dm-list"),
    path("/<int:user_id>/messages", DMConversationMessagesView.as_view(), name="dm-conversation-messages"),
    path("/messages/<int:dm_id>", DMRetrieveUpdateDestroyView.as_view(), name="dm-message-retrieve-update-destroy"),
]
