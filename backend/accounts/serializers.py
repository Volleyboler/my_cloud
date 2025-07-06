from rest_framework import serializers
from .models import User
import re

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9]{3,19}$', value):
            raise serializers.ValidationError("Некорректный формат логина")
        return value

    def validate_email(self, value):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            raise serializers.ValidationError("Некорректный email")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Пароль должен быть не менее 6 символов")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Пароль должен содержать цифры")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Пароль должен содержать заглавные буквы")
        if not any(char in "!@#$%^&*()-_=+[]{}|;:,.<>?/" for char in value):
            raise serializers.ValidationError("Пароль должен содержать спецсимволы")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)