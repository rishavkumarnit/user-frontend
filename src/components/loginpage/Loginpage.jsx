import React, { useState } from "react";
import "./loginpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Data } from "../../App";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(Data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://finalprojectbackend-u5cq.onrender.com/api/employees/login",
        {
          email,
          password,
        }
      );
  
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setLoading(false);
      await navigate("/dashboard");
    } catch (err) {

      setLoading(false);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-logo">
          Canova<span className="logo-crm">CRM</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="input-group">
            <input
              type="email"
              placeholder="test@test.com"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="test@test.com"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            <span>{loading ? "Logging in..." : "Submit"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
