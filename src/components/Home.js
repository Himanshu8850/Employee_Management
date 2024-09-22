import "../css/home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const user = localStorage.getItem("userName");
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter employees based on the search query
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employees/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee._id !== id)
          );
          alert("Employee deleted successfully");
          navigate("/");
        } else {
          console.error("Failed to delete employee");
          alert("Failed to delete employee");
        }
      } catch (error) {
        console.error("Error while deleting employee:", error);
        alert("An error occurred while deleting the employee");
      }
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (!user) {
      console.log("navigated");
      navigate("/login");
    } else {
      fetchEmployees().catch((error) => {
        console.error("An error occurred while saving the session:", error);
      });
    }
  }, [navigate, user]);

  return (
    <>
      <div className="employee-list">
        <div className="header-container">
          <h2>Employee List</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearchChange}>All</button>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <div>Total Count: {filteredEmployees.length}</div>
        <button onClick={() => navigate("/create-employee")}>
          Create Employee
        </button>
        <table>
          <thead>
            <tr>
              <th>Unique Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={`/uploads/${employee.image}`}
                    alt={employee.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.course}</td>
                <td>{new Date(employee.createdDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => navigate(`/edit-employee/${employee._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, employee._id)}
                    className="delete-button"
                  >
                    Delete Employee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
