from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def register_user(request):
    ...


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
    ...


@permission_classes([IsAuthenticated])
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
    ...


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def user_status_admin(request, user_id):
    ...
