from django.urls import path

from .views import (
    GroupConversationMessagesView,
    GroupListCreateView,
    GroupMessageRetrieveUpdateDestroyView,
    GroupRetrieveDestroyView,
)

urlpatterns = [
    path("", GroupListCreateView.as_view(), name="group-create-list"),
    path("/<int:group_id>", GroupRetrieveDestroyView.as_view(), name="group-retrieve-destroy"),
    path(
        "/<int:group_id>/messages",
        GroupConversationMessagesView.as_view(),
        name="group-conversation-messages",
    ),
    path(
        "/<int:group_id>/messages/<int:message_id>",
        GroupMessageRetrieveUpdateDestroyView.as_view(),
        name="group-message-retrieve-update-destroy",
    ),
]
