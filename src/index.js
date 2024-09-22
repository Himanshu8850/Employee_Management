import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import CreateEmployee from "./components/CreateEmployee";
import EditEmployee from "./components/EditEmployee";
import Header from "./components/Header";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  let currentPage;

  // Mapping page paths to their respective names
  if (currentPath === "/") {
    currentPage = "Home";
  } else if (currentPath === "/dashboard") {
    currentPage = "Home";
  } else if (currentPath === "/create-employee") {
    currentPage = "Create Employee";
  } else if (currentPath.startsWith("/edit-employee/")) {
    currentPage = "Edit Employee";
  } else if (currentPath === "/login") {
    currentPage = "Login";
  } else {
    currentPage = "Page";
  }

  return (
    <>
      <Header page={currentPage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dashboard" element={<Home />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

root.render(
  <Router>
    <App />
  </Router>
);

reportWebVitals();
