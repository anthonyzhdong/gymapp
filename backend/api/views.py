from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # here is all the users
    serializer_class = User # what kind fo data we need to accept to make a user
    permission_classes = (AllowAny) # create new user
    
