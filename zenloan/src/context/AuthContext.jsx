import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Check if user is logged in (Runs on mount)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/user`, {
          withCredentials: true, // Ensures cookies are sent
        });

        if (res.status === 200) {
          setUser(res.data); // Set authenticated user
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, [API_BASE_URL]); // Ensure API changes trigger a re-fetch

  // Login function
  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }, 
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUser(res.data.user); // Store user in state
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
