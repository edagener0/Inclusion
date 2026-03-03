from django.db import models
from django.contrib.auth.models import AbstractUser
from .validators import validate_avatar
from common.models import TimeStampedModel
from django.db.models import Q
from friends.models import Friend

class User(TimeStampedModel, AbstractUser):
    avatar = models.ImageField(
        upload_to= "avatars",
        default="avatars/default.webp",
        validators=[validate_avatar],
    )
    is_private = models.BooleanField(default=False, null=False)
    biography = models.TextField(max_length=1000, null=True, blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "email",
        "first_name",
        "last_name",
        "password"
    ]

    @property
    def friends(self):
        return User.objects.filter(
            Q(friends_as_user1__user2=self) |
            Q(friends_as_user2__user1=self)
        ).distinct().order_by("created_at")
    
    @property
    def is_friends_with(self, other_user):
        return Friend.objects.filter(
            Q(user1 = self, user2 = other_user) |
            Q(user1 = other_user, user2 = self)
        ).exists()