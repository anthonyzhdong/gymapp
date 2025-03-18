import { useState, useEffect } from "react";
import api from "../api";
import Workout from "../components/Workout";
import WorkoutForm from "../components/WorkoutForm";
import "../styles/home.css";

function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    // Get current user info
    fetchUserInfo();
    
    // Get workouts
    getWorkouts();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/api/user/current/");
      if (response.data) {
        // Set user information
        setUsername(response.data.username || response.data.first_name || "User");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWorkouts = () => {
    api
      .get("/api/workouts/")
      .then((res) => res.data)
      .then((data) => {
        setWorkouts(data);
        console.log("Workouts:", data);
      })
      .catch((err) => alert(err));
  };

  const deleteWorkout = (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      api.delete(`/api/workouts/${id}/`).then((res) => {
        if (res.status === 204) {
          alert("Workout Deleted");
          getWorkouts();
        } else {
          alert("Error Deleting Workout");
        }
      }).catch((err) => alert(err));
    }
  };

  const handleCreateWorkout = (workoutData) => {
    api.post("/api/workouts/", workoutData).then((res) => {
      if (res.status === 201) {
        alert("Workout Created");
        setShowForm(false);
        getWorkouts();
      } else {
        alert("Error Creating Workout");
      }
    }).catch((err) => {
      console.error("Error creating workout:", err);
      alert("Error creating workout: " + err.message);
    });
  };

  const handleUpdateWorkout = (workoutData) => {
    api.put(`/api/workouts/${editingWorkout.id}/`, workoutData).then((res) => {
      if (res.status === 200) {
        alert("Workout Updated");
        setShowForm(false);
        setEditingWorkout(null);
        getWorkouts();
      } else {
        alert("Error Updating Workout");
      }
    }).catch((err) => {
      console.error("Error updating workout:", err);
      alert("Error updating workout: " + err.message);
    });
  };

  const startEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="user-welcome">
        <h1>Welcome, {username}!</h1>
        <a href="/logout" className="logout-link">Logout</a>
      </div>
      
      {!showForm ? (
        <div className="workouts-section">
          <div className="section-header">
            <h2>Your Workouts</h2>
            <button 
              className="new-workout-btn"
              onClick={() => {
                setEditingWorkout(null);
                setShowForm(true);
              }}
            >
              Create New Workout
            </button>
          </div>
          
          {workouts.length === 0 ? (
            <p className="no-workouts">
              No workouts found. Click 'Create New Workout' to get started!
            </p>
          ) : (
            workouts.map((workout) => (
              <Workout 
                key={workout.id} 
                workout={workout} 
                onDelete={deleteWorkout}
                onEdit={startEditWorkout}
              />
            ))
          )}
        </div>
      ) : (
        <div className="form-section">
          <div className="form-header">
            <button 
              className="back-btn"
              onClick={() => {
                setShowForm(false);
                setEditingWorkout(null);
              }}
            >
              ← Back to Workouts
            </button>
          </div>
          
          <WorkoutForm 
            onSubmit={editingWorkout ? handleUpdateWorkout : handleCreateWorkout}
            initialData={editingWorkout}
          />
        </div>
      )}
    </div>
  );
}

export default Home;