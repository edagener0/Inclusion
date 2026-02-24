from django.db import models
from content.models import LongFormContent

class Inc(LongFormContent):
    content = models.CharField(max_length=1000, null=False, blank=False)
