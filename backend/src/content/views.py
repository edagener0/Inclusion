from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import UserLikesContent, Content
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

class LikeContentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, content_id):

        content = get_object_or_404(Content, id = content_id)
        
        _, created = UserLikesContent.objects.get_or_create(
                            user = self.request.user,
                            content = content
                        )

        return Response(
            {
                "detail": "Liked Successfully!" if created else "You've already liked the content",
                "liked": True,
            },
            status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
        
    def delete(self, request, content_id):
        content = get_object_or_404(Content, id = content_id)

        deleted_count, _  = UserLikesContent.objects.filter(
            user = self.request.user,
            content = content
        ).delete()

        return Response(
            {
                "detail": "Unliked successfully" if deleted_count else "You had not liked this content",
                "liked": False,
            },
            status = status.HTTP_200_OK
        )
