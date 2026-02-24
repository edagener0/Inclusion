from django.urls import path
from .views import LikeContentView

urlpatterns = [
    path("/like/<int:content_id>", LikeContentView.as_view(), name="like-content"),
]