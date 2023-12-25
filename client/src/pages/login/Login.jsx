import React, { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post("api/auth/login", formData)
      localStorage.setItem("currentUser", JSON.stringify(data))
      navigate("/")
    } catch (error) {
      setError(error.response.data)
    }
  }

  return (
    <div className="login">
      <form  onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          onChange={handleChange}
          name="username"
          type="text"
          placeholder="johndoe"
        />

        <label htmlFor="">Password</label>
        <input
          onChange={handleChange}
          name="password"
          type="password"
        />
        <button type="submit">Login</button>
        {error && error}
      </form>
    </div>
  );
}

export default Login;