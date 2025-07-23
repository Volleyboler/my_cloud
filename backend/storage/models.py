import os
import uuid
from django.db import models
from django.conf import settings


def generate_file_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{uuid.uuid4()}{ext}"
    return os.path.join('uploads', str(instance.user.id), unique_filename)


class File(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='files'
    )
    original_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    file = models.FileField(upload_to=generate_file_path)
    share_link = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.original_name

    @property
    def owner_username(self):
        return self.user.username
    
    class Meta:
        permissions = [
            ('can_view_all_files', 'Can view all files'),
            ('can_share_all_files', 'Can share all files'),
        ]

    def __str__(self):
        return f"{self.original_name} (owner: {self.user.username})"
