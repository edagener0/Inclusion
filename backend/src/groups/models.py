from django.db import models
from messaging.models import Message
from django.contrib.auth import get_user_model
from common.models import TimeStampedModel
from authentication.validators import validate_avatar

User = get_user_model()
    
class GroupChat(TimeStampedModel):
    name = models.CharField(max_length=255, null=False, blank=False)
    avatar = models.ImageField(
        upload_to= "avatars",
        default="avatars/default.webp",
        validators=[validate_avatar],
    )
    members = models.ManyToManyField(User, through='GroupParticipants', related_name='group_chats')

class GroupParticipants(TimeStampedModel):

    class RoleChoices(models.TextChoices):
        MEMBER = 'MEMBER', 'Member'
        ADMIN = 'ADMIN', 'Admin'

    pk = models.CompositePrimaryKey('user', 'group')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_participations')
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name='participants')
    role = models.CharField(max_length=10, choices=RoleChoices.choices, default=RoleChoices.MEMBER)

class GroupMessage(Message):
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name='messages')