



# Privacy-Preserving Loan Approval System

## Overview

**Privacy-Preserving Loan Approval System** is a fintech application designed to allow banks to securely approve loans without compromising users' financial privacy.  
It leverages techniques like **Differential Privacy** and **Homomorphic Encryption** to ensure sensitive financial data remains confidential throughout the approval process.

---

## Features

- 🔒 **Secure Data Sharing**: User financial data is shared in a privacy-preserving manner, preventing exposure of sensitive information.
- 🧠 **Privacy Techniques**: Implementation of **Differential Privacy** and/or **Homomorphic Encryption** to secure user data.
- 🔍 **Transparent Loan Approval Process**: Users maintain control over their data; banks make decisions without seeing personal details.
- 🏦 **Two Roles**:
  - **User**: Submits loan applications securely.
  - **Bank Admin**: Reviews and approves/rejects loans based on secured, privacy-preserved data.

---

## Tech Stack

- **Backend**: Node.js  Express 
- **Database**: MongoDB 
- **Encryption**: Homomorphic encryption 
- **Frontend**: React.js 
- **Authentication**: JWT 
- **Security**: HTTPS, Secure Cookies, Data Encryption

---

## How It Works

1. **User Registration/Login**:  
   Users sign up and securely log in to the system.

2. **Application Submission**:  
   Users fill out a loan application form including financial details.

3. **Data Protection**:  
   All submitted data is encrypted or perturbed using privacy techniques before being stored in the database.

4. **Bank Admin Review**:  
   Admins can view necessary metrics/statistics (e.g., credit score range, income range) but cannot view raw personal data.

5. **Loan Decision**:  
   Admin approves/rejects based on secured insights.

6. **User Notification**:  
   Users are informed about the approval/rejection status via the app.

---

## Database Security

- All sensitive fields (e.g., income, assets, liabilities) are either:
  - Encrypted using **Homomorphic Encryption** (allowing computation on encrypted data), or
  - Processed using **Differential Privacy** (adding noise to data to prevent individual identification).
- Personal Identifiable Information (PII) is stored separately with strong encryption (AES-256).

---



## Roles & Permissions

| Role        | Permissions                                                  |
| ----------- | ------------------------------------------------------------- |
| User        | Register, Login, Submit Loan Application, View Loan Status    |
| Bank Admin  | View Applications (privacy-preserved), Approve/Reject Loans   |

---

## Future Enhancements

- 📈 Add AI-based predictive scoring (on encrypted data) for faster approvals.
- 🛡️ Implement Zero-Knowledge Proofs (ZKPs) for even stronger privacy.
- 📄 Generate downloadable reports for users and admins.

---

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SaiSravaniGunda/zenloan.git
   cd Fintech-NIITW
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   cd ../zenloan
   npm install
   ```

3. **Configure Environment Variables**:
   - Database URI
   - Encryption keys
   - JWT Secret
   

4. **Run the app**:
   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd zenloan
     npm run dev
     ```

5. **Access the Application**:  
   Open `http://localhost:3000` in your browser.

---



