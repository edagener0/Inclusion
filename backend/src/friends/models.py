from django.db import models
from common.models import TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class FriendRequest(TimeStampedModel):
    pk = models.CompositePrimaryKey("from_user_id", "to_user_id")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_request")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_request")

    def save(self, *args, **kwargs):
        if self.user.id == self.user2.id:
            raise ValueError("user1 and user2 must be different users.")
        
class Friend(TimeStampedModel):
    pk = models.CompositePrimaryKey("user1_id", "user2_id")
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends_as_user1")
    user2= models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends_as_user2")

    def save(self, *args, **kwargs):
        if self.user1.id == self.user2.id:
            raise ValueError("user1 and user2 must be different users.")
        
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1

        return super().save(*args, **kwargs)