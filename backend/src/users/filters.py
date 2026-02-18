import django_filters
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(field_name="username", lookup_expr="icontains")
    first_name = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name"]