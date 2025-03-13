import React from 'react';

function Workout({workout, onDelete}) {

    const formattedDate = new Date(workout.created_at).toLocaleDateString("en-US")


    return <div className = "workout-container">
        <p className = "workout-title">{workout.title}</p>
        <p className = "workout-content">{workout.content}</p>
        <p className = "workout-date">{formattedDate}</p>
        <button className = "delete-button"onClick = {() => onDelete(workout.id)}>
            Delete
        </button>
    </div>


}

export default Workout