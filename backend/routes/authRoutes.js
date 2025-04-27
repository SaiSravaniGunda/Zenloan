const express = require("express");
const { registerUser, loginUser, verifyUser, logoutUser, fetchUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user",fetchUser);
module.exports = router;
