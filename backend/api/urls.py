from django.urls import path
from . import views

urlpatterns = [
    path("workouts/", views.WorkoutListCreate.as_view(), name="workout_list"),
    path("workouts/delete/<int:pk>/", views.WorkoutDelete.as_view(), name="workout_delete"),
]