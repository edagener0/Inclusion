from django.db.models import Exists, OuterRef, Q, Value, BooleanField, Subquery, Count, IntegerField
from django.db.models.functions import Coalesce
from friends.models import Friend


class FriendAnnotationMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        friends_as_user1 = Friend.objects.filter(
            user1_id=OuterRef("id")
        ).values("user1_id").annotate(
            c=Count("user2_id")
        ).values("c")

        friends_as_user2 = Friend.objects.filter(
            user2_id=OuterRef("id")
        ).values("user2_id").annotate(
            c=Count("user1_id")
        ).values("c")

        qs = qs.annotate(
            friends_count=Coalesce(Subquery(friends_as_user1, output_field=IntegerField()), 0) +
                          Coalesce(Subquery(friends_as_user2, output_field=IntegerField()), 0)
        )

        if not user.is_authenticated:
            return qs.annotate(
                is_friend=Value(False, output_field=BooleanField())
            )

        return qs.annotate(
            is_friend=Exists(
                Friend.objects.filter(
                    Q(user1_id=user.id, user2_id=OuterRef("id")) |
                    Q(user1_id=OuterRef("id"), user2_id=user.id)
                )
            )
        )