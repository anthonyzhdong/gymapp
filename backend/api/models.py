from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Workout(models.Model):
    title = models.CharField(max_length=100) # name of the workout
    content = models.TextField() # description of the workout
    created_at = models.DateTimeField(auto_now_add=True) # date and time the workout was created
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "workout") # owner of the workout
    
    def __str__(self):
        return self.name # return the name of the workout
    
