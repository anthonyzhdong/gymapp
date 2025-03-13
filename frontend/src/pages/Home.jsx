import { useState, useEffect } from "react";
import api from "../api";
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
        }).catch((err) => alert(err))
        getWorkout()
        // write frontend removal of workout from list
    }

    const createWorkout = (e) => {
        e.preventDefault()
        api.post("/api/workouts/", {content, title}).then((res) => {
            if(res.status === 201){
                alert("Workout Created")
            }else{
                alert("Error Creating Workout")
            }
        }).catch((err) => alert(err))
        getWorkout()
    }


    return <div>Home</div>

}

export default Home