from django.db import models
from common.models import TimeStampedModel
from django.db.models import Q, F
from django.conf import settings

# avoid circular import
User = settings.AUTH_USER_MODEL

class FriendRequest(TimeStampedModel):
    pk = models.CompositePrimaryKey("from_user_id", "to_user_id")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_request")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_request")

    def save(self, *args, **kwargs):
        if self.from_user.id == self.to_user.id:
            raise ValueError("from_user and to_user must be different users.")
        
        return super().save(*args, **kwargs)
        
class Friend(TimeStampedModel):
    pk = models.CompositePrimaryKey("user1_id", "user2_id")
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends_as_user1")
    user2= models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends_as_user2")

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(user1_id__lt=F("user2_id")),
                name="user1_id_lt_user2_id",
            ),
        ]

    def save(self, *args, **kwargs):
        if self.user1.id == self.user2.id:
            raise ValueError("user1 and user2 must be different users.")
        
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1

        return super().save(*args, **kwargs)
    