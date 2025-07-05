from rest_framework.decorators import api_view

from django.shortcuts import render


@api_view(['GET'])
def get_files(request):
    ...


@api_view(['POST'])
def upload_file(request):
    ...


@api_view(['POST'])
def share_file(request, file_id):
    ...


@api_view(['GET'])
def download_file(request, file_id):
    ...


@api_view(['PATCH'])
def rename_file(request, file_id):
    ...


@api_view(['PATCH'])
def update_file_comment(request, file_id):
    ...


@api_view(['DELETE'])
def delete_file(request, file_id):
    ...


@api_view(['GET'])
def download_shared_file(request, unique_code):
    ...
