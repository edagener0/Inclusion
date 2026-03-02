from django.urls import path
from .views import (
    FriendRequestCreateView,
    FriendRequestListReceivedView,
    FriendRequestListSentView,
    FriendRequestRetrieveReceivedView,
    FriendRequestRetrieveDestroySentView,
)

urlpatterns = [
    path("/requests", FriendRequestCreateView.as_view(), name="friend-request-create"),
    path("/requests/received", FriendRequestListReceivedView.as_view(), name="friend-request-list-received"),
    path("/requests/received/<int:from_user_id>", FriendRequestRetrieveReceivedView.as_view(), name="friend-request-retrieve-received"),
    path("/requests/sent", FriendRequestListSentView.as_view(), name="friend-request-list-sent"),
    path("/requests/sent/<int:to_user_id>", FriendRequestRetrieveDestroySentView.as_view(), name="friend-request-retrieve-destroy-sent")
]