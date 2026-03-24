from django.db import models
from django.contrib.auth import get_user_model
from common.models import TimeStampedModel
from django.db.models import (
    OuterRef,
    Count,
    Exists
)
from django.db.models import Q
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class ContentQuerySet(models.QuerySet):

    def visible_to_friends(self, user):
        return self.filter(
            Q(user=user) |
            Q(user__in=user.friends)
        )

    def visible_to(self, user):
        return self.filter(
            Q(user__is_private=False) |
            Q(user=user) |
            Q(user__in=user.friends)
        )
    
    def with_likes_data(self, user):
        from content.models import UserLikesContent

        likes_subquery = UserLikesContent.objects.filter(
            user=user,
            content_id=OuterRef("pk")
        )

        return self.annotate(
            likes_count=Count("likes"),
            is_liked=Exists(likes_subquery)
        )
  
class Content(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    objects = ContentQuerySet.as_manager()

class UserLikesContent(models.Model):
    pk = models.CompositePrimaryKey("user_id", "content_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name="likes")

class ShortFormContent(Content):
    pass

class LongFormContent(Content):
    pass


class Favorite(TimeStampedModel):
    pk = models.CompositePrimaryKey(
        "user_id",
        "content_type_id",
        "object_id"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()

    content_object = GenericForeignKey("content_type", "object_id")