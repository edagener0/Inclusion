from django.db import models
from content.models import LongFormContent
from common.validators import (
    validate_media_file_extension,
    validate_media_file_size
)

class Post(LongFormContent):
    file = models.FileField(
        upload_to="posts/",
        validators=[validate_media_file_extension, validate_media_file_size]
    )
    description = models.CharField(max_length=2000, blank=False, null=True)