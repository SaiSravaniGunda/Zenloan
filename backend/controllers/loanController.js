const Loan = require("../models/Loan");
const User = require("../models/User");

exports.applyLoan = async (req, res) => {
  try {
    const { amount, purpose } = req.body;
    const staticUserId = "67c9b45b78c4c3aa8790e5f0"; // Only this user can apply

    
    const user = await User.findById(staticUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newLoan = new Loan({
      user: staticUserId,
      amount,
      purpose,
      encryptedIncome: user.encryptedIncome,
      encryptedCreditScore: user.homomorphicCreditScore,
    });

    await newLoan.save();
    res.status(201).json({ message: "Loan application submitted successfully" });
  } catch (error) {
    console.error("Loan application error:", error);
    res.status(500).json({ message: "Loan application failed", error });
  }
};



// Get User's Loan Applications
exports.getUserLoans = async (req, res) => {
  try {
    // console.log(hit);
    // const userId = req.token.userId;
    // console.log(userId);
    const loans = await Loan.find({ user: '67c9b45b78c4c3aa8790e5f0' });

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan requests", error });
  }
};

// Get All Loan Applications (Admin)
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user", "fullName email");
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all loans", error });
  }
};

// // Approve/Reject Loan (Admin)
// exports.updateLoanStatus = async (req, res) => {
//   try {
//     const { loanId, status } = req.body;
//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const loan = await Loan.findById(loanId);
//     if (!loan) return res.status(404).json({ message: "Loan not found" });

//     loan.status = status;
//     await loan.save();

//     res.status(200).json({ message: `Loan ${status} successfully` });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating loan status", error });
//   }
// };


exports.updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    // Validate status input
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the loan and update its status
    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { status },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({ message: `Loan ${status} successfully`, updatedLoan });
  } catch (error) {
    console.error("Error updating loan status:", error);
    res.status(500).json({ message: "Failed to update loan status" });
  }
};
exports.getPendingLoans = async (req, res) => {
  try {
    const pendingLoans = await Loan.find({ status: "pending" }).populate("user", "fullName email");
    res.status(200).json(pendingLoans);
  } catch (error) {
    console.error("Error fetching pending loans:", error);
    res.status(500).json({ message: "Failed to fetch pending loans" });
  }
};

