from django.db import models
from content.models import ShortFormContent
from common.validators import (
    validate_media_file_size,
    validate_media_file_extension
)

class Story(ShortFormContent):
    file = models.FileField(
        upload_to="stories/",
        validators=[validate_media_file_extension, validate_media_file_size]
    )
