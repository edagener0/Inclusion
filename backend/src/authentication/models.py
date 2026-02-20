from django.db import models
from django.contrib.auth.models import AbstractUser
from .validators import validate_avatar

class User(AbstractUser):
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