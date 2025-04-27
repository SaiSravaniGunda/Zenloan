const crypto = require("crypto");
const paillierBigint = require("paillier-bigint");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/emailService");

const AES_ALGORITHM = "aes-256-cbc";
const AES_SECRET_KEY = Buffer.from(process.env.SECRET_KEY, "hex");


function encryptData(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(AES_ALGORITHM, AES_SECRET_KEY, iv);
    let encrypted = cipher.update(data.toString(), "utf-8", "hex");
    encrypted += cipher.final("hex");
    return { encrypted, iv: iv.toString("hex") };
}


function decryptData(encryptedData, iv) {
    try {
        const decipher = crypto.createDecipheriv(AES_ALGORITHM, AES_SECRET_KEY, Buffer.from(iv, "hex"));
        let decrypted = decipher.update(encryptedData, "hex", "utf-8");
        decrypted += decipher.final("utf-8");
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return "Decryption Error";
    }
}


function encryptCreditScore(creditScore, publicKey) {
    return publicKey.encrypt(BigInt(creditScore)).toString(); 
}


function decryptCreditScore(encryptedScore, privateKey) {
    try {
        return privateKey.decrypt(BigInt(encryptedScore)).toString();
    } catch (error) {
        console.error("Credit score decryption failed:", error);
        return "Decryption Error";
    }
}

const tempUsers = new Map();


async function generateHomomorphicKeys() {
    return await paillierBigint.generateRandomKeys(2048);
}


exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, dateOfBirth, governmentID, employmentType, income, creditScore, role } = req.body;
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already registered" });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const incomeData = encryptData(income);
        const governmentIDData = encryptData(governmentID);

        const { publicKey, privateKey } = await generateHomomorphicKeys();
        const encryptedCreditScore = encryptCreditScore(creditScore, publicKey);

        tempUsers.set(email, {
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            dateOfBirth,
            identityVerificationHash: governmentIDData.encrypted,
            employmentType,
            encryptedIncome: incomeData.encrypted,
            ivIncome: incomeData.iv,
            homomorphicCreditScore: encryptedCreditScore, 
            privateKey: {
                lambda: privateKey.lambda.toString(), 
                mu: privateKey.mu.toString(), 
            },
            role: role || "borrower",
            verificationCode,
        });

        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ message: "Verification code sent to email." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Verify User
exports.verifyUser = async (req, res) => {
    try {
        const { email, code } = req.body;
        const userData = tempUsers.get(email);
        if (!userData || userData.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code or no pending registration." });
        }

        const newUser = new User({
            ...userData,
            isVerified: true,
        });

        await newUser.save();
        tempUsers.delete(email);
        res.status(200).json({ message: "Email verified. You can now log in." });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Verification failed", error });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !user.isVerified) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error });
    }
};


exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed", error });
    }
};


exports.fetchUser = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.status(200).json({ email: decoded.email, role: decoded.role });
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};
