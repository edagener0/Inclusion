from django.core.exceptions import ValidationError
import os

MAX_MEDIA_FILE_SIZE = 200 * 1024 * 1024
def validate_media_file_extension(value):
    valid_extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".avi"]
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in valid_extensions:
        raise ValidationError("File must be an image or video.")
    
def validate_media_file_size(value):
    if value.size > MAX_MEDIA_FILE_SIZE:
        raise ValidationError("Media file size too big!")