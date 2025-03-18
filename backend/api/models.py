from django.db import models
from django.contrib.auth.models import User


class Workout(models.Model):
    title = models.CharField(max_length=100)  # name of the workout
    created_at = models.DateTimeField(auto_now_add=True)  # date and time the workout was created
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")  # owner of the workout
    notes = models.TextField(blank=True, null=True)  # optional notes about the workout
    
    def __str__(self):
        return self.title


class Exercise(models.Model):
    name = models.CharField(max_length=100)  # name of the exercise
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="exercises")  # associated workout
    order = models.IntegerField(default=0)  # order of this exercise in the workout
    
    def __str__(self):
        return f"{self.name} in {self.workout.title}"


class Set(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="sets")  # associated exercise
    weight = models.DecimalField(max_digits=6, decimal_places=2)  # weight used for this set
    reps = models.IntegerField()  # number of repetitions for this set
    set_number = models.IntegerField()  # which set this is (1, 2, 3, etc.)
    completed = models.BooleanField(default=False)  # whether this set has been completed
    
    class Meta:
        ordering = ['set_number']  # order sets by set number
    
    def __str__(self):
        return f"Set {self.set_number} of {self.exercise.name}: {self.weight} x {self.reps}"