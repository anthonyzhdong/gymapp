import {useState} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/form.css"

function Form({route, method}){
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault() //prevent us from submitting form 

        try{
            const res = await api.post(route, {
                firstName,
                lastName,
                email,
                password
            })
            
            if(method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            }else{
                navigate("/login")
            }

        }catch(error){
            alert(error)
        }finally{
            setLoading(false)
        }
    }

    // Show all fields for registration, only email and password for login
    const isRegister = method !== "login"

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        
        {isRegister && (
            <>
                <input 
                    className="form-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                />
                <input 
                    className="form-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                />
            </>
        )}
        
        <input 
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
        />
        <input 
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
        />
        <button 
            className="form-button" 
            type="submit"
            disabled={loading}
        >
            {loading ? "Processing..." : name}
        </button>
    </form>
}

export default Form