from django.db import models
from messaging.models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class DM(Message):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')