from django.urls import path
from . import views

urlpatterns = [
    # Workout endpoints
    path("workouts/", views.WorkoutListCreate.as_view(), name="workout_list"),
    path("workouts/<int:pk>/", views.WorkoutDetail.as_view(), name="workout_detail"),
    
    # Exercise endpoints
    path("workouts/<int:workout_id>/exercises/", views.ExerciseListCreate.as_view(), name="exercise_list"),
    path("workouts/<int:workout_id>/exercises/<int:pk>/", views.ExerciseDetail.as_view(), name="exercise_detail"),
    
    # Set endpoints
    path("exercises/<int:exercise_id>/sets/", views.SetListCreate.as_view(), name="set_list"),
    path("exercises/<int:exercise_id>/sets/<int:pk>/", views.SetDetail.as_view(), name="set_detail"),
    
    # User endpoint
    path("user/current/", views.CurrentUserView.as_view(), name="current_user"),
]