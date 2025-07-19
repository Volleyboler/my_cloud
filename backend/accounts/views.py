import logging
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import RegisterSerializer
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

logger = logging.getLogger(__name__)

@permission_classes([AllowAny])
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            "message": "Регистрация успешна",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_user_list(request):
    if not request.user.is_admin:
        logger.warning(f"User {request.user.username} tried to access user list without permission")
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
        logger.warning(f"User {request.user.username} tried to delete user without permission")
        return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
        user.delete()
        logger.info(f"User {user.username} deleted successfully")
        return Response({"message": "Пользователь удален"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        logger.warning(f"User with ID {user_id} not found")
        return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
@api_view(['POST'])
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
                'email': user.email,
                'is_admin': user.is_admin
            }
        }, status=status.HTTP_200_OK)
    return Response(
        {'error': 'Неверные учетные данные'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response({"message": "Выход выполнен успешно"}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
@api_view(['PATCH'])
def user_status_admin(request, user_id):
    if not request.user.is_admin:
        logger.warning(f"User {request.user.username} tried to change admin status without permission")
        return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.warning(f"User with ID {user_id} not found")
        return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)
    is_admin = request.data.get('is_admin')
    if is_admin is None:
        logger.warning(f"No 'is_admin' parameter provided for user ID {user_id}")
        return Response({"error": "Не указан параметр is_admin"}, status=status.HTTP_400_BAD_REQUEST)
    user.is_admin = is_admin
    user.save()
    logger.info(f"Admin status for user {user.username} updated to {is_admin}")
    return Response({"message": "Статус пользователя обновлен"}, status=status.HTTP_200_OK)

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf(request):
    response = Response({'detail': 'CSRF cookie set'})
    response["Access-Control-Allow-Origin"] = request.headers.get('Origin', '*')
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth_status(request):
    return Response({
        'isAuthenticated': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_admin': request.user.is_admin
        }
    }, status=status.HTTP_200_OK)
