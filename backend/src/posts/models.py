from django.db import models
from content.models import LongFormContent
from common.validators import (
    validate_media_file_extension,
    validate_media_file_size
)
from common.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(LongFormContent):
    file = models.FileField(
        upload_to="posts/",
        validators=[validate_media_file_extension, validate_media_file_size]
    )
    description = models.CharField(max_length=2000, blank=False, null=True)

class FavoritePost(TimeStampedModel):
    pk = models.CompositePrimaryKey("user_id", "post_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="favorite_posts")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=False, related_name="favorited_by")