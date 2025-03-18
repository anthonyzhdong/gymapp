from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Workout(models.Model):
    title = models.CharField(max_length=100) # name of the workout
    notes = models.TextField() # description of the workout
    created_at = models.DateTimeField(auto_now_add=True) # date and time the workout was created
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "workout") # owner of the workout
    
    def __str__(self):
        return self.title # return the name of the workout
    
class Exercise(models.Model):
    name = models.CharField(max_length=100) # name of the exercise
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name = "exercise") # workout the exercise belongs to
    order = models.IntegerField(default=0) # order of the exercise in the workout
    
    def __str__(self):
        return f"{self.name} in {self.workout.title}" # return the name of the exercise and the workout it belongs to
    
class Set(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name = "set") # exercise the set belongs to
    weight = models.IntegerField() # weight of the set
    reps = models.IntegerField()
    set_number = models.IntegerField()
    completed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ["set_number"]
    def __str__(self): 
        return f"Set {self.set_number} of {self.exercise.name}: {self.weight} x {self.reps}"
    
