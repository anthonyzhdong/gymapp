from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Workout

class WorkoutListCreate(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = (IsAuthenticated,) # only authenticated users can access
    
    def get_queryset(self):
        user = self.request.user
        return Workout.objects.filter(owner=user)

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # here is all the users
    serializer_class = UserSerializer # what kind fo data we need to accept to make a user
    permission_classes = (AllowAny,) # create new user
    
