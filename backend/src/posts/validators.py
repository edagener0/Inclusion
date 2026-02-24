from django.core.exceptions import ValidationError
import os

def validate_post_file(value):
    valid_extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".avi"]
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in valid_extensions:
        raise ValidationError("File must be an image or video.")