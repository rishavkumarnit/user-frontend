import React, { useState, useContext, useEffect } from "react";
import "./profile.css";
import Navbar from "../navbar/Navbar";
import { Data } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const { setUser } = useContext(Data);
  const [form, setForm] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: user.password,
    confirm: user.password,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
    navigate("/");
  };

  const fetchUser = async () => {

    const res = await axios.get(
      `https://finalprojectbackend-u5cq.onrender.com/api/employees/${user.id}`
    );
    localStorage.setItem("user", JSON.stringify(res.data));
    await setUser(res.data);
 
  };

  const handleSave = async () => {
    if (form.password !== form.confirm) {
      alert("The password differs in confirm password");
      return;
    }
    await axios.put("https://finalprojectbackend-u5cq.onrender.com/api/employees/", {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
    });
    fetchUser();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  return (
    <div className="profile-body">
      <div className="circle-1"></div>
      <div className="circle-2"></div>

      <div className="mobile-header">
        <div className="mobile-brand">
          Canova<span className="logo-crm">CRM</span>
        </div>
        <div className="rem mobile-title">
          <span onClick={() => navigate("/dashboard")} className="back">
            ‹
          </span>{" "}
          Profile
        </div>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>First name</label>
          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Last name</label>
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} readOnly />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        <div className="profile-actions">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Profile;
