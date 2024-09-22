const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from this origin
    credentials: true, // Allow cookies and credentials to be sent
  })
);
app.use(express.json());
app.use(cookieParser());
const loginRoutes = require("./routes/loginRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
// MongoDB connection
mongoose
  .connect(process.env.DBLINK)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.secret, // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Helps mitigate XSS attacks
    },
  })
);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/login", loginRoutes);
app.use("/api/employees", employeeRoutes);
// Error Handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
