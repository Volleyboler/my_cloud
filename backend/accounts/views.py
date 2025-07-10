from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import RegisterSerializer
import re


@permission_classes([AllowAny])
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Регистрация успешна"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_user_list(request):
    if not request.user.is_admin:
            return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all()
    data = [{
        'id': u.id,
        'username': u.username,
        'full_name': u.full_name,
        'email': u.email,
        'is_admin': u.is_admin
    } for u in users]

    return Response(data, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_user(request, user_id):
    if not request.user.is_admin:
        return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "Пользователь удален"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
@api_view(['POST', 'OPTIONS'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            'message': 'Успешный вход',
            'user': {
                'id': user.id,
                'username': user.username,
                'full_name': user.full_name,
                'email': user.email,
                'is_admin': user.is_admin
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def user_logout(request):
    logout(request)
    return Response({"message": "Выход выполнен успешно"}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def user_status_admin(request, user_id):
    if not request.user.is_admin:
        return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

    is_admin = request.data.get('is_admin')
    if is_admin is None:
        return Response({"error": "Не указан параметр is_admin"}, status=status.HTTP_400_BAD_REQUEST)

    user.is_admin = is_admin
    user.save()
    return Response({"message": "Статус пользователя обновлен"}, status=status.HTTP_200_OK)
