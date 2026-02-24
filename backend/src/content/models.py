from django.db import models
from django.contrib.auth import get_user_model
from common.models import TimeStampedModel

User = get_user_model()

class Content(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class UserLikesContent(models.Model):
    pk = models.CompositePrimaryKey("user_id", "content_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)


class ShortFormContent(Content):
    pass


class LongFormContent(Content):
    pass