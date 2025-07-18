import os
import uuid
from datetime import timezone
from django.http import Http404, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import File
from django.core.files.storage import default_storage
from django.urls import reverse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_files_list(request):
    files = File.objects.filter(user=request.user)
    data = [{
        'id': f.id,
        'original_name': f.original_name,
        'file_size': f.file_size,
        'upload_date': f.upload_date.isoformat(),
        'last_download_date': f.last_download_date.isoformat() if f.last_download_date else None,
        'comment': f.comment,
        'share_link': request.build_absolute_uri(
            reverse('download_shared_file', kwargs={'share_link': f.share_link}))
    } for f in files]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    if 'file' not in request.FILES:
        return Response({'error': 'Файл не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    comment = request.POST.get('comment', '')
    
    file_obj = File.objects.create(
        user=request.user,
        original_name=file.name,
        file_size=file.size,
        comment=comment,
        file=file
    )
    
    return Response({
        'id': file_obj.id,
        'original_name': file_obj.original_name,
        'file_size': file_obj.file_size,
        'comment': file_obj.comment,
        'upload_date': file_obj.upload_date.isoformat()
    }, status=status.HTTP_201_CREATED)

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def share_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    share_link = request.build_absolute_uri(reverse('download_shared_file', kwargs={'share_link': file_obj.share_link}))
    return Response({'share_link': share_link}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def download_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    file_path = file_obj.file.path
    if not os.path.exists(file_path):
        raise Http404("Файл не найден")
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.original_name}"'
        file_obj.last_download_date = timezone.now()
        file_obj.save()
        return response

@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def rename_file(request, file_id):
    new_name = request.data.get('newName')
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    old_path = file_obj.file.path
    ext = os.path.splitext(new_name)[1]
    new_filename = f"{uuid.uuid4()}{ext}"
    new_path = os.path.join('uploads', str(request.user.id), new_filename)
    os.rename(old_path, new_path)
    file_obj.original_name = new_name
    file_obj.file.name = new_path
    file_obj.save()
    return Response({'message': 'Файл переименован'}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def update_file_comment(request, file_id):
    new_comment = request.data.get('newComment')
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    file_obj.comment = new_comment
    file_obj.save()
    return Response({'message': 'Комментарий обновлен'}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    os.remove(file_obj.file.path)
    file_obj.delete()
    return Response({'message': 'Файл удален'}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def download_shared_file(request, share_link):
    db_file = get_object_or_404(File, share_link=share_link)
    file_path = db_file.file.path
    if not os.path.exists(file_path):
        raise Http404("Файл не найден")
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{db_file.original_name}"'
        db_file.last_download_date = timezone.now()
        db_file.save()
        return response