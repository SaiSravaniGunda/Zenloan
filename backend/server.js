const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON body
app.use(cookieParser()); // Middleware to parse cookies

const frontendUrl = process.env.REACT_APP_FRONTEND_URL;

const corsOptions = {
  origin: frontendUrl, // Allow frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions)); // Enable CORS

// Import Routes
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
