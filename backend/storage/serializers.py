from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='user.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = File
        fields = ['id', 'original_name', 'file_size', 'upload_date', 
                 'last_download_date', 'comment', 'share_link', 'owner', 'file_url']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.file.url)
        return None
    