from django.shortcuts import render
from rest_framework.decorators import api_view


@api_view(['POST'])
def register_user(request):
    ...


@api_view(['GET'])
def get_user_list(request):
    ...


@api_view(['DELETE'])
def delete_user(request, user_id):
    ...


@api_view(['POST', 'OPTIONS'])
def user_login(request):
    ...


@api_view(['GET'])
def user_logout(request):
    ...


@api_view(['PATCH'])
def user_status_admin(request, user_id):
    ...
