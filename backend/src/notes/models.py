from django.db import models
from content.models import ShortFormContent

class Note(ShortFormContent):
    content = models.CharField(max_length=100, null=False, blank=False)
