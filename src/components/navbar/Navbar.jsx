import React from "react";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <div className=" bottom-nav">
      <div
        className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={
            isActive("/dashboard") ? "./home-active.png" : "./home-inactive.png"
          }
          alt=""
        />
        <span>Home</span>
      </div>
      <div
        className={`nav-item ${isActive("/leads") ? "active" : ""}`}
        onClick={() => navigate("/leads")}
      >
        <img
          src={isActive("/leads") ? "./leads-active.png" : "./mdi_leads.png"}
          alt=""
        />
        <span>Leads</span>
      </div>
      <div
        className={`nav-item ${isActive("/schedule") ? "active" : ""}`}
        onClick={() => navigate("/schedule")}
      >
        <img
          src={
            isActive("/schedule") ? "./schedule-active.png" : "./schedule.png"
          }
          alt=""
        />
        <span>Schedule</span>
      </div>
      <div
        className={`nav-item ${isActive("/profile") ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <img
          src={isActive("/profile") ? "./profile-active.png" : "./Group.png"}
          alt=""
        />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Navbar;
