from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Workout, Exercise, Set

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]
        
class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'weight', 'reps', 'set_number', 'completed']

class ExerciseSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True, read_only=False)
    
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'order', 'sets']
    
    def create(self, validated_data):
        sets_data = validated_data.pop('sets')
        exercise = Exercise.objects.create(**validated_data)
        
        for set_data in sets_data:
            Set.objects.create(exercise=exercise, **set_data)
            
        return exercise
    
    def update(self, instance, validated_data):
        sets_data = validated_data.pop('sets', None)
        
        # Update the exercise fields
        instance.name = validated_data.get('name', instance.name)
        instance.order = validated_data.get('order', instance.order)
        instance.save()
        
        # Update or create sets
        if sets_data is not None:
            # Delete any sets not included in the update
            instance.sets.exclude(id__in=[s.get('id') for s in sets_data if s.get('id')]).delete()
            
            for set_data in sets_data:
                set_id = set_data.get('id', None)
                if set_id:
                    # Update existing set
                    set_instance = Set.objects.get(id=set_id, exercise=instance)
                    set_instance.weight = set_data.get('weight', set_instance.weight)
                    set_instance.reps = set_data.get('reps', set_instance.reps)
                    set_instance.set_number = set_data.get('set_number', set_instance.set_number)
                    set_instance.completed = set_data.get('completed', set_instance.completed)
                    set_instance.save()
                else:
                    # Create new set
                    Set.objects.create(exercise=instance, **set_data)
        
        return instance

class WorkoutSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=False)
    owner_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ["id", "title", "created_at", "owner", "notes", "exercises", "owner_username"]
        extra_kwargs = {"owner": {"read_only": True}}
    
    def get_owner_username(self, obj):
        return obj.owner.username
    
    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        workout = Workout.objects.create(**validated_data)
        
        for exercise_data in exercises_data:
            sets_data = exercise_data.pop('sets')
            exercise = Exercise.objects.create(workout=workout, **exercise_data)
            
            for set_data in sets_data:
                Set.objects.create(exercise=exercise, **set_data)
        
        return workout
    
    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises', None)
        
        # Update the workout fields
        instance.title = validated_data.get('title', instance.title)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.save()
        
        # Update or create exercises and their sets
        if exercises_data is not None:
            # Delete any exercises not included in the update
            instance.exercises.exclude(id__in=[e.get('id') for e in exercises_data if e.get('id')]).delete()
            
            for exercise_data in exercises_data:
                sets_data = exercise_data.pop('sets')
                exercise_id = exercise_data.get('id', None)
                
                if exercise_id:
                    # Update existing exercise
                    exercise = Exercise.objects.get(id=exercise_id, workout=instance)
                    exercise.name = exercise_data.get('name', exercise.name)
                    exercise.order = exercise_data.get('order', exercise.order)
                    exercise.save()
                    
                    # Handle sets for this exercise
                    exercise.sets.exclude(id__in=[s.get('id') for s in sets_data if s.get('id')]).delete()
                    
                    for set_data in sets_data:
                        set_id = set_data.get('id', None)
                        if set_id:
                            # Update existing set
                            set_instance = Set.objects.get(id=set_id, exercise=exercise)
                            set_instance.weight = set_data.get('weight', set_instance.weight)
                            set_instance.reps = set_data.get('reps', set_instance.reps)
                            set_instance.set_number = set_data.get('set_number', set_instance.set_number)
                            set_instance.completed = set_data.get('completed', set_instance.completed)
                            set_instance.save()
                        else:
                            # Create new set
                            Set.objects.create(exercise=exercise, **set_data)
                else:
                    # Create new exercise with its sets
                    exercise = Exercise.objects.create(workout=instance, **exercise_data)
                    
                    for set_data in sets_data:
                        Set.objects.create(exercise=exercise, **set_data)
        
        return instance