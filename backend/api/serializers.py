from django.contrib.auth.models import User
from rest_framework import serializers
from.models import Workout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # represents a user in django
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} # accept password when creating a new user but not return it 
        
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user # accepts validated data and creates a new user with it
    
class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ["id", "name", "description", "created_at", "owner"] # fields to be serialized
        extra_kwargs = {"owner": {"read_only": True}} # Tell us who owner is but dont write it
        

        