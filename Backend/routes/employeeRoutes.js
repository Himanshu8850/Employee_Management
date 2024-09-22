const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee.js");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads")); // join with the current directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG are allowed"), false);
    }
  },
});
// Create Employee
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  console.log(req.session.user);
  const { name, email, mobile, designation, gender, course } = req.body;

  try {
    const employee = new Employee({
      image: req.file.filename,
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      createdDate: new Date(),
    });

    await employee.save();
    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Employees
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// find employee by ID
router.get("/find/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee by ID
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee); // Return the employee details
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Edit Employee
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.designation = designation || employee.designation;
    employee.gender = gender || employee.gender;
    employee.course = course || employee.course;

    if (req.file) {
      employee.image = req.file.filename;
    }

    await employee.save();
    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Employee
router.delete("/:id", authMiddleware, async (req, res) => {
  const empid = req.params.id;
  try {
    const employee = await Employee.findByIdAndDelete(empid);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
