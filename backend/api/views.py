from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, WorkoutSerializer, ExerciseSerializer, SetSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Workout, Exercise, Set

class WorkoutListCreate(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated] # only authenticated users can access
    
    def get_queryset(self):
        user = self.request.user
        return Workout.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            print(serializer.errors)
            
class WorkoutDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Workout.objects.filter(owner=user)
            

class ExerciseListCreate(generics.ListCreateAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        workout_id = self.kwargs.get('workout_id')
        workout = get_object_or_404(Workout, id=workout_id, owner=self.request.user)
        return Exercise.objects.filter(workout=workout)
    
    def perform_create(self, serializer):
        workout_id = self.kwargs.get('workout_id')
        workout = get_object_or_404(Workout, id=workout_id, owner=self.request.user)
        serializer.save(workout=workout)

class ExerciseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        workout_id = self.kwargs.get('workout_id')
        workout = get_object_or_404(Workout, id=workout_id, owner=self.request.user)
        return Exercise.objects.filter(workout=workout)

class SetListCreate(generics.ListCreateAPIView):
    serializer_class = SetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        exercise_id = self.kwargs.get('exercise_id')
        exercise = get_object_or_404(Exercise, id=exercise_id, workout__owner=self.request.user)
        return Set.objects.filter(exercise=exercise)
    
    def perform_create(self, serializer):
        exercise_id = self.kwargs.get('exercise_id')
        exercise = get_object_or_404(Exercise, id=exercise_id, workout__owner=self.request.user)
        serializer.save(exercise=exercise)

class SetDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        exercise_id = self.kwargs.get('exercise_id')
        exercise = get_object_or_404(Exercise, id=exercise_id, workout__owner=self.request.user)
        return Set.objects.filter(exercise=exercise)
            
            
class WorkoutDelete(generics.DestroyAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated] # only authenticated users can access
    
    def get_queryset(self):
        user = self.request.user
        return Workout.objects.filter(owner=user)
    


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # here is all the users
    serializer_class = UserSerializer # what kind fo data we need to accept to make a user
    permission_classes = (AllowAny,) # create new user
    
# Add new view to get current user info
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)