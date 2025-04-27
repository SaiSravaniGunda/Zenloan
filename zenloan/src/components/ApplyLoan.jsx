import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const ApplyLoan = () => {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = Cookies.get("token"); // Get token from cookies

      const response = await axios.post(
        "http://localhost:5000/api/loans/apply",
        { amount, purpose },
        {
          withCredentials: true, // Ensure cookies are sent
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      console.log(error); // ✅ Fixed typo from "conole" to "console"
      setMessage(error.response?.data?.message || "Loan application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Apply for a Loan</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Loan Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Purpose</label>
          <input
            type="text"
            className="form-control"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Apply"}
        </button>
      </form>
    </div>
  );
};

export default ApplyLoan;
