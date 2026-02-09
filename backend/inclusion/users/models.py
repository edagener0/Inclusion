from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    picture = models.ImageField(
        upload_to= "profile_images"
    )
    is_private = models.BooleanField(default=False, null=False, blank=False)
    biography = models.TextField(max_length=1000, null=True, blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "password"
    ]