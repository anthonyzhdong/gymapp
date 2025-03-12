from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # represents a user in django
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"required": True}} # accept password when creating a new user but not return it 
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user # accepts validated data and creates a new user with it