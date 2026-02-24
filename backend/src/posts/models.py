from django.db import models
from content.models import LongFormContent
from .validators import validate_post_file

class Post(LongFormContent):
    file = models.FileField(
        upload_to="posts/",
        validators=[validate_post_file]
    )
    description = models.CharField(max_length=2000, blank=False, null=True)