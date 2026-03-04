from django.db import models
from messaging.models import Message
from common.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class GroupChat(TimeStampedModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")
    participants = models.ManyToManyField(User, related_name="joined_groups")

class GroupMessage(Message):
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name="messages")


