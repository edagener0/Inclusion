from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ImproperlyConfigured

class BaseFavoriteListView(ListAPIView):
    permission_classes = [IsAuthenticated]

    model = None
    serializer_class = None

    def get_queryset(self):
        if self.model is None:
            raise ImproperlyConfigured("You must set model")

        if self.serializer_class is None:
            raise ImproperlyConfigured("You must set serializer class")
        
        return (
            self.model.objects
            .filter(favorited_by__user=self.request.user)
            .visible_to(self.request.user)
            .with_likes_data(self.request.user)
            .order_by("-favorited_by__created_at")
        )