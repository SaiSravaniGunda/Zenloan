import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix import
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); // Extract role from token
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token on logout
    setUserRole(null);
    onLogout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={() => setIsOpen(false)}>
          ZenLoan
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto text-center">
            {/* Public Routes */}
            {!userRole && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* Borrower Routes */}
            {userRole === "borrower" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/apply-loan" onClick={() => setIsOpen(false)}>
                    Apply for Loan
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/loan-status" onClick={() => setIsOpen(false)}>
                    Loan Status
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications" onClick={() => setIsOpen(false)}>
                    Notifications
                  </Link>
                </li>
              </>
            )}

            {/* Admin Routes */}
            {userRole === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/review-applications" onClick={() => setIsOpen(false)}>
                    Review Applications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/fraud-alerts" onClick={() => setIsOpen(false)}>
                    Fraud Alerts
                  </Link>
                </li>
              </>
            )}

            {/* Logout Button */}
            {userRole && (
              <li className="nav-item">
                <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
