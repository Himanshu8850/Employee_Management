import React, { useState } from "react";
import "../css/CreateEmployee.css"; // Import the CSS file

const CreateEmployee = () => {
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

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEmployee({ ...employee, course: [...employee.course, value] });
    } else {
      setEmployee({
        ...employee,
        course: employee.course.filter((c) => c !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(employee.email)) {
      setEmailError("Invalid email address");
      return;
    }

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("mobile", employee.mobile);
    formData.append("designation", employee.designation);
    formData.append("gender", employee.gender);
    formData.append("course", employee.course.join(", "));
    formData.append("image", employee.image);

    const response = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.duplicateEmail) {
      setDuplicateEmail(true);
    } else if (data) {
      alert(data.message);
    }
  };

  return (
    <div className="create-employee-container">
      <h2>Create Employee</h2>
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
              if (!/\S+@\S+\.\S+/.test(employee.email)) {
                setEmailError("Invalid email address");
              } else {
                setEmailError("");
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
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
