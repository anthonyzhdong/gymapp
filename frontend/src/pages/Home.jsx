import { useState, useEffect } from "react";
import api from "../api";
import Workout from "../components/Workout";
import "../styles/home.css";
import { data } from "react-router-dom";

function Home(){

    const [workout, setWorkouts] = useState([])
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")


    useEffect(() => {
        getWorkout()
    }, [])

    const getWorkout = () => {
        api
            .get("/api/workouts/")
            .then((res) => res.data)
            .then((data) => { setWorkouts(data); console.log(data) })
            .catch((err) => alert(err));
        
    }

    const deleteWorkout = (id) => {
        api.delete(`/api/workouts/delete/${id}/`).then((res)=> {
            if(res.status === 204){
                alert("Workout Deleted")
            }else{
                alert("Error Deleting Workout")
            }

            getWorkout()
        }).catch((err) => alert(err))
        // write frontend removal of workout from list
    };

    const createWorkout = (e) => {
        e.preventDefault()
        api.post("/api/workouts/", {content, title}).then((res) => {
            if(res.status === 201){
                alert("Workout Created")
            }else{
                alert("Error Creating Workout")
            }
            getWorkout()
        }).catch((err) => alert(err))
        
    };


    return <div>
        <div>
            <h2>Workouts</h2>

            {workout.map((workout) => (
                <Workout workout = {workout} onDelete={deleteWorkout} key={workout.id}/>
            ))}


        </div>
        <h2>Create Workout</h2>
        <form onSubmit={createWorkout}>
            <label htmlFor="title">Title</label>
        <br/>
            <input 
                type = "text" 
                id="title" 
                name = "title" 
                required 
                onChange={(e) => setTitle(e.target.value)} 
                value = {title}
            />
            <label htmlFor="content">Content</label>
            <br/>
            <textarea 
                id="content" 
                name = "content" 
                required 
                value = {content}
                onChange={(e) => setContent(e.target.value)} 
                
            ></textarea>
            <br/>
                <input type = "submit" value = "Submit"></input>    


        </form>

    </div>

}

export default Home