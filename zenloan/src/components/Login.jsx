import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Ensure cookies are sent from the backend
      );

      setMessage(response.data.message);

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 }); // Store token for 7 days
        setIsLoggedIn(true); // Update user state
        navigate("/"); // Redirect to home
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="submit-button">Sign In</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
