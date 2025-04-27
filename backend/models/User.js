const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: function () { return this.role !== "admin"; } 
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: function () { return this.role !== "admin"; } 
  },
  dateOfBirth: { 
    type: Date, 
    required: function () { return this.role !== "admin"; } 
  },
  identityVerificationHash: {  // Store only a hashed version of the ID
    type: String,
    required: function () { return this.role !== "admin"; }
  },
  employmentType: { 
    type: String, 
    enum: ["salaried", "self-employed"], 
    required: function () { return this.role !== "admin"; } 
  },
  encryptedIncome: { 
    type: String, 
    required: function () { return this.role !== "admin"; } 
  },
  ivIncome: { type: String, required: function () { return this.role !== "admin"; } },

  homomorphicCreditScore: {  // Used for privacy-preserving calculations
    type: String, 
    required: function () { return this.role !== "admin"; } 
  },

  role: { type: String, enum: ["borrower", "admin"], default: "borrower" },
  isVerified: { type: Boolean, default: false }, // Email verification status
  verificationCode: { type: String, index: { expires: '10m' } }, // Code expires in 10 minutes
});

// Hash password before saving (except for admin)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.role !== "admin") {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
