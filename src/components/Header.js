import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/header.css";
function Header({ page }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userName");
    navigate("/login");
  };
  const user = localStorage.getItem("userName");
  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="./logo.png" alt="Logo" className="header-logo" />
        <li className="PageName">{page}</li>
      </div>
      <ul style={{ alignItems: "center" }}>
        {user && <li>Welcome {user}</li>}
        {page != "Home" && (
          <button
            style={{ display: "flex" }}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Home
          </button>
        )}
        {user && (
          <button style={{ display: "flex" }} onClick={logout}>
            LogOut
          </button>
        )}
      </ul>
    </div>
  );
}

export default Header;
