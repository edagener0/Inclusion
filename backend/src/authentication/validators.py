from django.core.exceptions import ValidationError
import os

MAX_AVATAR_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"]

def validate_avatar(image):

    ext = os.path.splitext(image.name)[1][1:].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError("Extension must belong to:", ALLOWED_EXTENSIONS)


    if image.size > MAX_AVATAR_SIZE:
        raise ValidationError("Avatar size too big!")