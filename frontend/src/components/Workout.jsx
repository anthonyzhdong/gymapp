import React, { useState } from 'react';
import "../styles/Workout.css";

function Workout({ workout, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(workout.created_at).toLocaleDateString("en-US");

  return (
    <div className="workout-container">
      <div className="workout-header" onClick={() => setExpanded(!expanded)}>
        <div className="workout-title-section">
          <h3 className="workout-title">{workout.title}</h3>
          <span className="workout-date">{formattedDate}</span>
        </div>
        <div className="workout-toggle">
          {expanded ? '▼' : '►'}
        </div>
      </div>

      {expanded && (
        <div className="workout-details">
          {workout.notes && (
            <div className="workout-notes">
              <p>{workout.notes}</p>
            </div>
          )}

          <div className="workout-exercises">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, index) => (
                <div key={exercise.id || index} className="exercise-item">
                  <h4 className="exercise-name">{exercise.name}</h4>
                  
                  <div className="sets-table">
                    <div className="sets-header">
                      <div className="set-column">Set</div>
                      <div className="weight-column">Weight (lbs)</div>
                      <div className="reps-column">Reps</div>
                    </div>
                    
                    {exercise.sets && exercise.sets.map((set, setIndex) => (
                      <div 
                        key={set.id || setIndex} 
                        className={`set-row ${set.completed ? 'completed-set' : ''}`}
                      >
                        <div className="set-column">Set {set.set_number}</div>
                        <div className="weight-column">{set.weight}</div>
                        <div className="reps-column">{set.reps}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-exercises">No exercises added to this workout.</p>
            )}
          </div>

          <div className="workout-actions">
            <button 
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(workout);
              }}
            >
              Edit
            </button>
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(workout.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workout;