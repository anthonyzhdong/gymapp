import { useState } from "react";
import "../styles/workout-form.css";

function WorkoutForm({ onSubmit, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [exercises, setExercises] = useState(
    initialData?.exercises || [createEmptyExercise()]
  );

  // Helper function to create an empty exercise object
  function createEmptyExercise() {
    return {
      name: "",
      order: 0,
      sets: [createEmptySet(1)]
    };
  }

  // Helper function to create an empty set object
  function createEmptySet(setNumber) {
    return {
      weight: "",
      reps: "",
      set_number: setNumber,
      completed: false
    };
  }

  // Add a new exercise to the workout
  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        ...createEmptyExercise(),
        order: exercises.length
      }
    ]);
  };

  // Remove an exercise from the workout
  const removeExercise = (exerciseIndex) => {
    if (exercises.length === 1) {
      // Keep at least one exercise
      setExercises([createEmptyExercise()]);
    } else {
      setExercises(
        exercises
          .filter((_, index) => index !== exerciseIndex)
          .map((exercise, index) => ({
            ...exercise,
            order: index
          }))
      );
    }
  };

  // Add a new set to an exercise
  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[exerciseIndex];
    const newSetNumber = currentExercise.sets.length + 1;
    
    currentExercise.sets.push(createEmptySet(newSetNumber));
    setExercises(updatedExercises);
  };

  // Remove a set from an exercise
  const removeSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[exerciseIndex];
    
    if (currentExercise.sets.length === 1) {
      // Keep at least one set
      currentExercise.sets = [createEmptySet(1)];
    } else {
      currentExercise.sets = currentExercise.sets
        .filter((_, index) => index !== setIndex)
        .map((set, index) => ({
          ...set,
          set_number: index + 1
        }));
    }
    
    setExercises(updatedExercises);
  };

  // Update an exercise's name
  const updateExerciseName = (exerciseIndex, name) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].name = name;
    setExercises(updatedExercises);
  };

  // Update a set's values
  const updateSetValue = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    
    // Convert to appropriate types
    if (field === 'weight') {
      value = value === '' ? '' : parseFloat(value);
    } else if (field === 'reps') {
      value = value === '' ? '' : parseInt(value);
    } else if (field === 'completed') {
      value = Boolean(value);
    }
    
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      alert("Please enter a workout title");
      return;
    }
    
    for (const exercise of exercises) {
      if (!exercise.name.trim()) {
        alert("Please enter a name for all exercises");
        return;
      }
      
      for (const set of exercise.sets) {
        if (set.weight === '' || set.reps === '') {
          alert("Please enter weight and reps for all sets");
          return;
        }
      }
    }
    
    // Submit form data
    onSubmit({
      title,
      notes,
      exercises
    });
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <div className="form-header">
        <h2>{initialData ? "Edit Workout" : "Create New Workout"}</h2>
      </div>
      
      <div className="form-group">
        <label htmlFor="title">Workout Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Monday Chest Day"
          className="form-input"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any details about this workout..."
          className="form-textarea"
        />
      </div>
      
      <div className="exercises-container">
        <h3>Exercises</h3>
        
        {exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="exercise-card">
            <div className="exercise-header">
              <div className="form-group">
                <label htmlFor={`exercise-${exerciseIndex}`}>Exercise Name</label>
                <input
                  type="text"
                  id={`exercise-${exerciseIndex}`}
                  value={exercise.name}
                  onChange={(e) => updateExerciseName(exerciseIndex, e.target.value)}
                  placeholder="e.g., Bench Press"
                  className="form-input"
                  required
                />
              </div>
              
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeExercise(exerciseIndex)}
              >
                Remove
              </button>
            </div>
            
            <div className="sets-container">
              <h4>Sets</h4>
              
              <div className="sets-header">
                <div className="set-column">Set</div>
                <div className="weight-column">Weight (lbs)</div>
                <div className="reps-column">Reps</div>
                <div className="actions-column">Actions</div>
              </div>
              
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="set-row">
                  <div className="set-column">
                    <span>Set {set.set_number}</span>
                  </div>
                  
                  <div className="weight-column">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={set.weight}
                      onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'weight', e.target.value)}
                      className="form-input weight-input"
                      required
                    />
                  </div>
                  
                  <div className="reps-column">
                    <input
                      type="number"
                      min="0"
                      value={set.reps}
                      onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'reps', e.target.value)}
                      className="form-input reps-input"
                      required
                    />
                  </div>
                  
                  <div className="actions-column">
                    <button
                      type="button"
                      className="remove-set-btn"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="add-set-btn"
                onClick={() => addSet(exerciseIndex)}
              >
                Add Set
              </button>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="add-exercise-btn"
          onClick={addExercise}
        >
          Add Exercise
        </button>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {initialData ? "Update Workout" : "Create Workout"}
        </button>
      </div>
    </form>
  );
}

export default WorkoutForm;