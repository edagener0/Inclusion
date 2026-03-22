from django.db import models
from content.models import LongFormContent
from common.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class Inc(LongFormContent):
    content = models.CharField(max_length=1000, null=False, blank=False)

class FavoriteInc(TimeStampedModel):
    pk = models.CompositePrimaryKey("user_id", "inc_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, related_name="favorite_incs")
    inc = models.ForeignKey(Inc, on_delete=models.CASCADE, null=False, related_name="favorited_by")