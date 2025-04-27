import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ApplyLoan from "./components/ApplyLoan";
import LoanStatus from "./components/LoanStatus";
import Notifications from "./components/Notifications";
import ReviewApplications from "./components/ReviewApplications";
import FraudAlerts from "./components/FraudAlerts";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function App() {
  const [user, setUser] = useState(null);

  // Check for token in cookies when the app loads
  useEffect(() => {
    const token = Cookies.get("token"); // Get token from cookies
    if (token) {
      setUser(true); // Set user as logged in
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token from cookies on logout
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass setUser to Login to update auth state */}
        <Route path="/login" element={<Login setIsLoggedIn={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
        <Route path="/loan-status" element={<LoanStatus />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/review-applications" element={<ReviewApplications />} />
        <Route path="/fraud-alerts" element={<FraudAlerts />} />
      </Routes>
    </Router>
  );
}

export default App;
