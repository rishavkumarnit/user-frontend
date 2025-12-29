import React, { useState } from "react";
import "./dashboard.css";
import Navbar from "../navbar/Navbar";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 60000);
  return () => clearInterval(id);
}, []);
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user.id;

  const [today, setToday] = useState({});
  const [last4, setLast4] = useState([]);
  const loadData = async () => {
    const res = await axios.get(
      `https://finalprojectbackend-u5cq.onrender.com/api/attendance/dashboard/${employeeId}`
    );
    setToday(res.data.today || {});
    setLast4(res.data.last4 || []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);
  const formatTime = (t) => (t ? new Date(t).toLocaleTimeString() : "--:--");
  const handleCheckIn = async () => {
    await axios.post("https://finalprojectbackend-u5cq.onrender.com/api/attendance/checkin", {
      employeeId,
    });
    loadData();
  };

  const handleCheckOut = async () => {
    await axios.post("https://finalprojectbackend-u5cq.onrender.com/api/attendance/checkout", {
      employeeId,
    });
    loadData();
  };

  const handleBreakToggle = async () => {
    if (!today.breakStart)
      await axios.post("https://finalprojectbackend-u5cq.onrender.com/api/attendance/break/start", {
        employeeId,
      });
    else if (!today.breakEnd)
      await axios.post("https://finalprojectbackend-u5cq.onrender.com/api/attendance/break/end", {
        employeeId,
      });
    loadData();
  };

  const [activities, setActivities] = useState([]);
  const getActivities = async () => {
    const res = await axios.get(
      `https://finalprojectbackend-u5cq.onrender.com/api/user-activity/${employeeId}`
    );
    setActivities(res.data);
  
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getActivities();
  }, []);
  const timeAgo = (date) => {
  const diff = Math.floor((now  - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hour ago`;
  return `${Math.floor(diff/86400)} day ago`;
};

  return (
    <div className="dashboard-body">
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <div className="dash-header">
        <div className="login-logo-dash">
          Canova<span className="logo-crm">CRM</span>
        </div>
        <div className="greeting">Good Morning</div>
        <div className="username">
          {user.firstname} {user.lastname}
        </div>
      </div>

      <div className="section">
        <div className="rem section-title">Timings</div>

        <div className="timing-card">
          <div>
            <div className="rem label">Check in</div>
            <div className="rem time">{formatTime(today.checkIn)}</div>
          </div>
          <div>
            <div className="rem label">Check Out</div>
            <div className="rem time">{formatTime(today.checkOut)}</div>
          </div>
          <div
            className={`toggle ${
              today.checkIn && today.checkOut
                ? "red-color" 
                : today.checkIn && !today.checkOut
                ? "on" 
                : ""
            }`}
            onClick={!today.checkIn ? handleCheckIn : handleCheckOut}
          />
        </div>

        <div className="log-card">
          <div className="timing-card-2">
            <div>
              <div className="label">Break</div>
              <div className="time">{formatTime(today.breakStart)}</div>
            </div>
            <div>
              <div className="label">Ended</div>
              <div className="time">{formatTime(today.breakEnd)}</div>
            </div>
            <div
              className={`toggle ${
                today.breakStart && !today.breakEnd
                  ? "on"
                  : today.breakStart
                  ? "red-color"
                  : ""
              }`}
              onClick={handleBreakToggle}
            />
          </div>

          <div className="all-logs">
            {last4.map((item, i) => (
              <div key={i} className="rem log-row">
                <div>
                  <div className="cell">Break</div>
                  <div className="cell">{formatTime(item.breakStart)}</div>
                </div>
                <div>
                  <div className="cell">Ended</div>
                  <div className="cell">{formatTime(item.breakEnd)}</div>
                </div>
                <div>
                  <div>Date</div>
                  <div>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="activity-section">
        <div className="rem activity-title">Recent Activity</div>

        {activities && activities.length > 0 && (
          <div className="rem activity-card">
            {activities.map((activity, i) => (
              <p key={i} className="activity-lines">
                • {activity.message} — {timeAgo(activity.createdAt)}
              </p>
            ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Dashboard;
