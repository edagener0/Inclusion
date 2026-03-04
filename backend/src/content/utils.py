from .models import UserLikesContent, Content
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from comments.models import Comment

def create_like_for_content(request, content_id):
    content = get_object_or_404(Content.objects.visible_to(request.user), id = content_id)
        
    _, created = UserLikesContent.objects.get_or_create(
                    user = request.user,
                    content = content
                )

    return Response(
        {
            "detail": "Liked Successfully!" if created else "You've already liked the content",
            "liked": True,
        },
        status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )

def remove_like_from_content(request, content_id):
    content = get_object_or_404(Content.objects.visible_to(request.user), id = content_id)

    deleted_count, _  = UserLikesContent.objects.filter(
            user = request.user,
            content = content
        ).delete()

    return Response(
        {
            "detail": "Unliked successfully" if deleted_count else "You had not liked this content",
            "liked": False,
        },
        status = status.HTTP_200_OK
    )

def create_comment_for_lf_content(kclass, lf_content_id, serializer, user):
    lf_content = get_object_or_404(kclass.objects.visible_to(user), pk=lf_content_id)
    serializer.save(lf_content=lf_content, user=user)

def get_queryset_comments_for_lf_content(kclass, lf_content_id, user):
    lf_content = get_object_or_404(kclass.objects.visible_to(user), pk=lf_content_id)
    return (
        Comment.objects
        .with_likes_data(user)
        .filter(lf_content=lf_content)
        .order_by("-likes_count")
    )