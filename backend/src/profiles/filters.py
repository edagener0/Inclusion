import django_filters
from django.contrib.auth import get_user_model
from django.db.models import Q, Value
from django.db.models.functions import Concat

User = get_user_model()

class ProfileFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(field_name="username", lookup_expr="icontains")
    first_name = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")
    name = django_filters.CharFilter(method="filter_name")

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name"]

    def filter_name(self, queryset, name, value):
        queryset = queryset.annotate(
            full_name = Concat(
                "first_name",
                Value(" "),
                "last_name"
            )
        ).filter(
            Q(username__icontains = value) |
            Q(first_name__icontains = value) |
            Q(last_name__icontains = value) |
            Q(full_name__icontains = value)
        ).order_by("first_name")

        return queryset