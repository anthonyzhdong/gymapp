import React from 'react'
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NotFound from "./pages/NotFound"
import Login from "./pages/login"
import Register from "./pages/register"
import Home from "./pages/home"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogOut(){
  localStorage.clear()
  return <Register  />

}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
             <Home /> 
          </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogOut />} /> 
        <Route path="/logout" element={<Logout />} />
        <Route path="/*" element={<NotFound />}></Route>

      </Routes>
    </BrowserRouter>

  )
}

export default App
