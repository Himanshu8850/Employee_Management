import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });

  const [emailError, setEmailError] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [newCourses, setNewCourses] = useState([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await fetch(
        `http://localhost:5000/api/employees/find/${id}`
      );
      const data = await response.json();
      setEmployee(data);
    };

    fetchEmployee();
  }, [id]);

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewCourses((prev) => [...prev, value]); // Add the new course
    } else {
      setNewCourses((prev) => prev.filter((c) => c !== value)); // Remove the course
    }
  };

  useEffect(() => {
    setEmployee((prev) => ({ ...prev, course: newCourses }));
  }, [newCourses]);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateMobile = (mobile) => /^\d+$/.test(mobile);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setMobileError("");

    if (!validateEmail(employee.email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (!validateMobile(employee.mobile)) {
      setMobileError("Mobile number must be numeric");
      return;
    }
    console.log(employee.course);
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("mobile", employee.mobile);
    formData.append("designation", employee.designation);
    formData.append("gender", employee.gender);
    formData.append(
      "course",
      Array.isArray(employee.course) ? employee.course.join(", ") : ""
    );
    if (employee.image) {
      formData.append("image", employee.image);
    }

    const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json();

    if (data.duplicateEmail) {
      setDuplicateEmail(true);
    } else {
      alert("Employee updated successfully");
      navigate("/"); // Redirect to employee list
    }
  };

  return (
    <div className="create-employee-container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) =>
              setEmployee({ ...employee, email: e.target.value })
            }
            onBlur={() => {
              if (!validateEmail(employee.email)) {
                setEmailError("Invalid email address");
              }
            }}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
          {duplicateEmail && <p className="error">Email already exists</p>}
        </div>
        <div className="form-group">
          <label>Mobile No:</label>
          <input
            type="text"
            value={employee.mobile}
            onChange={(e) =>
              setEmployee({ ...employee, mobile: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Designation:</label>
          <select
            value={employee.designation}
            onChange={(e) =>
              setEmployee({ ...employee, designation: e.target.value })
            }
            required
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <div>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={employee.gender === "Male"}
              onChange={(e) =>
                setEmployee({ ...employee, gender: e.target.value })
              }
              required
            />{" "}
            Male
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={employee.gender === "Female"}
              onChange={(e) =>
                setEmployee({ ...employee, gender: e.target.value })
              }
              required
            />{" "}
            Female
          </div>
        </div>
        <div className="form-group">
          <label>Course:</label>
          <div>
            <input
              type="checkbox"
              value="MCA"
              checked={employee.course.includes("MCA")}
              onChange={handleCourseChange}
            />{" "}
            MCA
            <input
              type="checkbox"
              value="BCA"
              checked={employee.course.includes("BCA")}
              onChange={handleCourseChange}
            />{" "}
            BCA
            <input
              type="checkbox"
              value="BSC"
              checked={employee.course.includes("BSC")}
              onChange={handleCourseChange}
            />{" "}
            BSC
          </div>
        </div>
        <div className="form-group">
          <label>Image Upload:</label>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={(e) =>
              setEmployee({ ...employee, image: e.target.files[0] })
            }
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
