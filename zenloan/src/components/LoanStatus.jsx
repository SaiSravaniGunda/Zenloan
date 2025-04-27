import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LoanStatus.css"; // Import the CSS file

const LoanStatus = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/loans/my-loans", {
          withCredentials: true,
        });
        setLoans(response.data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="loan-status-container">
      <h2 className="title">Check Loan Status</h2>
      {loading ? (
        <p className="loading">Loading loans...</p>
      ) : loans.length > 0 ? (
        <div className="table-responsive">
          <table className="loan-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Credit Score</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const creditScore = loan.user?.name === "Manideep Dandapanthula" ? 550 : 650;
                return (
                  <tr key={loan._id}>
                    <td>{loan._id}</td>
                    <td>${loan.amount.toLocaleString()}</td>
                    <td>{loan.purpose}</td>
                    <td className={`status ${loan.status.toLowerCase()}`}>{loan.status}</td>
                    <td>{creditScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-loans">No loans found.</p>
      )}
    </div>
  );
};

export default LoanStatus;
