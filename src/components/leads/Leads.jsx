import React from "react";
import "./leads.css";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Leads = () => {
    const navigate = useNavigate();
  const [leads, setLeads] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user.id;

  const fetchLeads = async (search = "") => {
    const res = await axios.get(
      `https://finalprojectbackend-u5cq.onrender.com/api/leads/my-leads/${employeeId}`,
      {
        params: {
          search,
        },
      }
    );
    setLeads(res.data);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads("");
  }, []);

  const [activeLead, setActiveLead] = useState(null);
  const [popup, setPopup] = useState(null);

  const openPopup = (lead, name) => {
    setActiveLead(lead);
    setPopup(name);
  };

  const getColor = (type) => {
    if (type === "Hot") return "orange";
    if (type === "Warm") return "yellow";
    if (type === "Cold") return "peach";
    return "orange";
  };

  const handleTypeChange = async (id, newType) => {
    await axios.put(`https://finalprojectbackend-u5cq.onrender.com/api/leads/${id}`, {
      type: newType,
    });
    setPopup("");
    fetchLeads();
  };
  const handleSchedule = async (id, date, time) => {
    const fullDateTime = new Date(`${date}T${time}`);
    if (fullDateTime < new Date()) {
      alert("backdate not allowed");
      return;
    }
    await axios.put(`https://finalprojectbackend-u5cq.onrender.com/api/leads/${id}`, {
      scheduleddate: fullDateTime,
    });
    setPopup("");
    fetchLeads();
  };

  const handleStatusChange = async (lead, newStatus) => {

    if (lead.scheduleddate && new Date() < new Date(lead.scheduleddate)) {
      alert("Lead can not be closed if scheduled");
      setPopup("");
      return;
    }
    try {
      await axios.put(`https://finalprojectbackend-u5cq.onrender.com/api/leads/${lead._id}`, {
        status: newStatus,
        employeeId: employeeId,
      });
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong";

      alert(message);
      setPopup("");
    }
    fetchLeads();
    setPopup("");
  };

  const formatScheduleDate = (value) => {
    if (!value || value === "-") return "Not Scheduled";

    const d = new Date(value);

    if (isNaN(d.getTime())) return "Not Scheduled";

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {

    fetchLeads(searchTerm);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLeads(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="leads-body">
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <div className="mobile-header">
        <div className="mobile-brand">
          Canova<span className="logo-crm">CRM</span>
        </div>
        <div className="rem mobile-title">
          <span onClick={() =>navigate("/dashboard")} className="back">‹</span> Leads
        </div>
      </div>

      <div className="leads-search">
        <span>
          <img onClick={handleSearch} src="./search.png" alt="" />
        </span>
        <span>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </span>
      </div>

      <div className="lead-list">
        {leads.map((lead, i) => {
          const color = getColor(lead.type);
          return (
            <div
              key={i}
              className="lead-card"
              style={{
                backgroundColor: lead.status === "Closed" ? "#DBDBDB" : "",
              }}
            >
              <div className={`lead-strip ${color}`}></div>

              <div className="lead-main">
                <div className="lead-info">
                  <div className="lead-name">{lead.name}</div>
                  <div className="lead-email">@{lead.email}</div>
                </div>

                <div
                  className={`lead-status ${color}`}
                  style={{
                    borderColor: lead.status === "Closed" ? "#F77307" : "",
                    opacity: lead.status === "Closed" ? "0.25" : "",
                  }}
                >
                  {lead.status}
                </div>
              </div>

              <div className="lead-footer">
                <div className="lead-date">
                  <img src="./lead-calendar.png" alt="" />
                  {formatScheduleDate(lead.scheduleddate)}
                </div>
                <div className="lead-icons">
                  <span>
                    <img
                      onClick={() => openPopup(lead, "type")}
                      className="icon-items"
                      src="./lead-type.png"
                      alt=""
                    />
                  </span>

                  <span>
                    <img
                      onClick={() => openPopup(lead, "schedule")}
                      className="icon-items"
                      src="./lead-schedule.png"
                      alt=""
                    />
                  </span>
                  <span>
                    <img
                      onClick={() => openPopup(lead, "status")}
                      className="icon-items"
                      src="./lead-status.png"
                      alt=""
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TYPE POPUP */}
      {popup === "type" && (
        <div className="popup">
         
          <div className="popup-box">
               <div onClick={()=>{setPopup("")}} className="cross">X</div>
            <div>Type</div>
            {["Hot", "Warm", "Cold"].map((t) => (
              <div
                key={t}
                className={`type-btn ${
                  t === "Hot"
                    ? "orange-clr"
                    : t === "Warm"
                    ? "yellow-clr"
                    : "peach-clr"
                }`}
                onClick={() => handleTypeChange(activeLead._id, t)}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
      {popup === "schedule" && (
        <div className="popup">
          <div className="popup-box-schedule">
               <div onClick={()=>{setPopup("")}} className="cross">X</div>
            <div className="dt-text">Date</div>
            <input
              className="date-time"
              type="date"
              onChange={(e) =>
                setActiveLead({ ...activeLead, _date: e.target.value })
              }
            />
            <div className="dt-text">Time</div>

            <input
              className="date-time"
              type="time"
              onChange={(e) =>
                setActiveLead({ ...activeLead, _time: e.target.value })
              }
            />
            <button
              onClick={() =>
                handleSchedule(
                  activeLead._id,
                  activeLead._date,
                  activeLead._time
                )
              }
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* STATUS POPUP */}
      {popup === "status" && (
        <div className="popup">
       
          <div className="popup-box-status">
                <div onClick={()=>{setPopup("")}} className="cross">X</div>
            <div className="ls-text">Lead Status</div>

            <select
              value={activeLead.status}
              onChange={(e) => {
 
                setActiveLead({
                  ...activeLead,
                  status: e.target.value,
                });
              }}
            >
              <option>Ongoing</option>
              <option>Closed</option>
            </select>

            <button
              onClick={() => handleStatusChange(activeLead, activeLead.status)}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Leads;
