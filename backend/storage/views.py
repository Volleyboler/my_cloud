import os
import uuid
import logging
from datetime import datetime
from django.http import Http404, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import File
from django.conf import settings
from django.core.files.storage import default_storage
from django.urls import reverse


logger = logging.getLogger(__name__)

def check_file_permission(request, file_obj):
    """Проверяет права доступа к файлу (либо владелец, либо админ)"""
    if not (request.user.is_admin or file_obj.user == request.user):
        logger.warning(f"User {request.user.username} tried to access file {file_obj.id} without permission")
        return False
    return True

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_files_list(request):
    user_id = request.query_params.get('user')
    if user_id and request.user.is_admin:
        files = File.objects.filter(user__id=user_id)
    else:
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id, user=request.user)
        
        share_link = request.build_absolute_uri(
            reverse('download_shared_file', kwargs={'share_link': str(file_obj.share_link)})
        )
        
        return Response(
            {
                'share_link': share_link,
                'file_id': file_obj.id,
                'original_name': file_obj.original_name
            }, 
            status=status.HTTP_200_OK
        )
        
    except File.DoesNotExist:
        return Response(
            {'error': 'Файл не найден или у вас нет прав доступа'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error sharing file: {str(e)}")
        return Response(
            {'error': 'Ошибка при генерации ссылки'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id)
        if not check_file_permission(request, file_obj):
            return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)
            
        file_path = os.path.join(settings.MEDIA_ROOT, file_obj.file.name)
        
        if not os.path.exists(file_path):
            raise Http404("Файл не найден на сервере")
            
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_obj.original_name}"'
            file_obj.last_download_date = datetime.now()
            file_obj.save()
            return response
            
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def rename_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id)
        if not check_file_permission(request, file_obj):
            return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)

        new_name = request.data.get('newName')
        if not new_name:
            return Response({'error': 'Не указано новое имя файла'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            old_path = os.path.join(settings.MEDIA_ROOT, file_obj.file.name)
            ext = os.path.splitext(file_obj.original_name)[1]
            new_filename = f"{uuid.uuid4()}{ext}"
            new_relative_path = os.path.join('uploads', str(file_obj.user.id), new_filename)
            new_full_path = os.path.join(settings.MEDIA_ROOT, new_relative_path)

            os.makedirs(os.path.dirname(new_full_path), exist_ok=True)
            os.rename(old_path, new_full_path)

            file_obj.original_name = new_name
            file_obj.file.name = new_relative_path
            file_obj.save()

            return Response({'message': 'Файл успешно переименован'}, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"Error renaming file: {str(e)}")
            return Response(
                {'error': f'Ошибка при переименовании файла: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_file_comment(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id)
        if not check_file_permission(request, file_obj):
            return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)
            
        new_comment = request.data.get('newComment')
        file_obj.comment = new_comment
        file_obj.save()
        return Response({'message': 'Комментарий обновлен'}, status=status.HTTP_200_OK)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id)
        if not check_file_permission(request, file_obj):
            return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)
            
        if os.path.exists(file_obj.file.path):
            os.remove(file_obj.file.path)
        file_obj.delete()
        return Response({'message': 'Файл удален'}, status=status.HTTP_200_OK)
    except File.DoesNotExist:
        return Response({'error': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        return Response(
            {'error': f'Ошибка при удалении файла: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_shared_file(request, share_link):
    file_obj = get_object_or_404(File, share_link=share_link)
    file_path = file_obj.file.path
    if not os.path.exists(file_path):
        raise Http404("Файл не найден")
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.original_name}"'
        file_obj.last_download_date = datetime.now()
        file_obj.save()
        return response