from django.db import models
from content.models import (
    Content, 
    LongFormContent,
)
class Comment(Content):
    lf_content = models.ForeignKey(LongFormContent, on_delete=models.CASCADE)
    commentary = models.CharField(max_length=1000, null=False, blank=False)