import { useState } from "react";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    governmentID: "",
    employmentType: "salaried",
    income: "",
    creditScore: "",
    role: "borrower",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailForVerification, setEmailForVerification] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({
      ...formData,
      role,
      ...(role === "admin"
        ? {
            fullName: "",
            phoneNumber: "",
            dateOfBirth: "",
            governmentID: "",
            employmentType: "",
            income: "",
            creditScore: "",
          }
        : {}),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${backendURL}/api/auth/register`, formData);
      setSuccess("Verification code sent to your email. Please verify.");
      setEmailForVerification(formData.email);
      setShowVerification(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${backendURL}/api/auth/verify`, {
        email: emailForVerification,
        code: verificationCode,
      });

      setSuccess("Verification successful! Your account has been created.");
      setShowVerification(false);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        dateOfBirth: "",
        governmentID: "",
        employmentType: "salaried",
        income: "",
        creditScore: "",
        role: "borrower",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed! Try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {!showVerification ? (
        <form onSubmit={handleSubmit}>
          <label>
            Role:
            <select name="role" value={formData.role} onChange={handleRoleChange}>
              <option value="borrower">Borrower</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {formData.role === "borrower" && (
            <>
              <label>
                Full Name:
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </label>
              <label>
                Phone Number:
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </label>
              <label>
                Date of Birth:
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </label>
              <label>
                Government ID:
                <input type="text" name="governmentID" value={formData.governmentID} onChange={handleChange} required />
              </label>
              <label>
                Employment Type:
                <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                </select>
              </label>
              <label>
                Income:
                <input type="text" name="income" value={formData.income} onChange={handleChange} required />
              </label>
              <label>
                Credit Score:
                <input type="text" name="creditScore" value={formData.creditScore} onChange={handleChange} required />
              </label>
            </>
          )}

          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>

          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <label>
            Enter Verification Code:
            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
          </label>
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
};

export default Signup;