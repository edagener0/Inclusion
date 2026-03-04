from django.db import models
from common.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(TimeStampedModel):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    content = models.CharField(max_length=800, null=False, blank=False)
