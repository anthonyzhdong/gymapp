import {useState} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/form.css"

function RegistrationForm({route}){
    const [username, setUsername] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault() //prevent us from submitting form 

        try{
            const res = await api.post(route, {
                username,
                first_name,
                last_name,
                email,
                password
            })
            navigate("/login")
            

        }catch(error){
            alert(error)
        }finally{
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>

        <input 
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
        />
        <input 
            className="form-input"
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
        />
        <input 
            className="form-input"
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
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
        <input 
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
        />
       
        <button 
            className="form-button" 
            type="submit"
            disabled={loading}
        >
            {loading ? "Processing..." : "Register"}
        </button>
    </form>
}

export default RegistrationForm