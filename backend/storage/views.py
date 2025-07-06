from datetime import timezone
import os

from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage

from models import File


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_files_list(request):
    files = File.objects.filter(user=request.user)
    data = [{
        'original_name': f.original_name,
        'file_size': f.file_size,
        'upload_date': f.upload_date.isoformat(),
        'last_download': f.last_download_date.isoformat() if f.last_download_date else None,
        'comment': f.comment,
        'share_link': f.share_link
    } for f in files]
    return Response(data, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def upload_file(request):
    file = request.FILES.get('file')
    comment = request.POST.get('comment', '')

    if not file:
        return Response({'error': 'Файл не выбран'}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user

    file_path = default_storage.save(f'uploads/{user.id}/{file.name}', file)

    db_file = File.objects.create(
        user=user,
        original_name=file.name,
        file_size=file.size,
        comment=comment,
        file_path=file_path
    )

    return Response({
        'message': 'Файл успешно загружен',
        'file': {
            'original_name': db_file.original_name,
            'file_size': db_file.file_size,
            'upload_date': db_file.upload_date.isoformat(),
            'comment': db_file.comment,
            'share_link': db_file.share_link
        }
    }, status=status.HTTP_201_CREATED)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def share_file(request, file_id):
    ...


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def download_file(request, file_id):
    ...


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def rename_file(request, file_id):
    ...


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def update_file_comment(request, file_id):
    ...


@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_file(request, file_id):
    file_id = request.data.get('file_id')
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
        file_obj.delete()
        return Response({"message": "Файл удален"}, status=status.HTTP_200_OK)
    except File.DoesNotExist:
        return Response({"error": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def download_shared_file(request, share_link):
    db_file = get_object_or_404(File, share_link=share_link)
    file_path = db_file.file_path.path

    if not os.path.exists(file_path):
        raise Http404("Файл не найден")

    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{db_file.original_name}"'

        db_file.last_download = timezone.now()
        db_file.save()

        return response
