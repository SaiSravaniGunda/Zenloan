import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Review.css";

const maskData = (data, visibleChars = 5) => {
  return data.length > visibleChars ? data.slice(0, visibleChars) + "..." : data;
};

// Mock decryption function (replace with actual logic if needed)
const decryptCreditScore = (encryptedScore) => {
  return parseInt(encryptedScore, 10); // Assuming encryption is reversible
};

// Function to categorize credit score
const getCreditRating = (score) => {
  if (score >= 10000) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 600) return "Poor";
  return "Very Poor";
};

const ReviewApplications = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/loans/pending")
      .then((res) => setLoans(res.data))
      .catch((err) => console.error("Error fetching loans:", err));
  }, []);

  const handleAction = (loanId, status) => {
    axios.put(`http://localhost:5000/api/loans/${loanId}/status`, { status })
      .then(() => setLoans(loans.filter((loan) => loan._id !== loanId)))
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <div className="review-container">
      <h2>Review Loan Applications</h2>
      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>User</th> <th>Email</th> <th>Amount</th> <th>Purpose</th> 
              <th>Credit Score</th> <th>Credit Rating</th> <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan="7">No pending applications</td></tr>
            ) : (
              loans.map((loan) => {
                const decryptedScore = loan.encryptedCreditScore 
                  ? decryptCreditScore(loan.encryptedCreditScore) 
                  : null;
                const rating = decryptedScore ? getCreditRating(decryptedScore) : "N/A";
                
                return (
                  <tr key={loan._id}>
                    <td>{loan.user?.fullName || "N/A"}</td>
                    <td>{loan.user?.email || "N/A"}</td>
                    <td>{loan.amount}</td>
                    <td>{loan.purpose}</td>
                    <td>{decryptedScore ? decryptedScore : "N/A"}</td>
                    <td>{rating}</td>
                    <td>
                      <button className="approve-btn" onClick={() => handleAction(loan._id, "approved")}>Approve</button>
                      <button className="reject-btn" onClick={() => handleAction(loan._id, "rejected")}>Reject</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewApplications;
