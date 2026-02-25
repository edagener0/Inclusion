from django.db import models
from content.models import (
    Content,
    LongFormContent
)


class Comment(Content):
    content = models.ForeignKey(LongFormContent, on_delete=models.CASCADE)
    commentary = models.CharField(max_length=500, null=False, blank=False)

    
