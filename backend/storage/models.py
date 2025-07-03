from django.db import models
from accounts.models import UserAccount


class File(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    original_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    file_path = models.CharField(max_length=255)
    share_link = models.CharField(max_length=255, unique=True)
    