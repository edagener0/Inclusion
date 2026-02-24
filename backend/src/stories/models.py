from django.db import models
from content.models import ShortFormContent
from posts.validators import validate_post_file

class Story(ShortFormContent):
    file = models.FileField(
        upload_to="stories/",
        validators=[validate_post_file]
    )
