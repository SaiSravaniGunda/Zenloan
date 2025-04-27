const express = require("express");
const { applyLoan, getUserLoans, getAllLoans, updateLoanStatus, getPendingLoans } = require("../controllers/loanController");
const { verifyToken, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/apply", applyLoan);
router.get("/my-loans", getUserLoans);
router.get("/all-loans", verifyToken, checkAdmin, getAllLoans);
router.get("/pending", getPendingLoans);
// router.put("/update-status", verifyToken, checkAdmin, updateLoanStatus);



// Approve or reject a loan (Admin only)
router.put("/:loanId/status", updateLoanStatus);

module.exports = router;


module.exports = router;
