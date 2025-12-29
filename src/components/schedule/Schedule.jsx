import React from "react";
import "./schedule.css";
import Navbar from "../navbar/Navbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const getInitials = (word) => {
    let first = "";
    let second = "";
    let findSecond = false;
    word = word.trim();
    for (let i = 0; i < word.length; i++) {
      if (!first) {
        first = word[i];
      } else if (word[i] === " ") {
        findSecond = true;
      } else if (findSecond && word[i] != " ") {
        second = word[i];
      }
      if (first && second) {
        break;
      }
    }
    return first + second;
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user.id;

  const [leads, setLeads] = useState([]);

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

  const [popup, setPopup] = useState(false);
  const [filter, setFilter] = useState("All");

  const handleFilter = async () => {
    if (filter === "All") {
      fetchLeads(searchTerm);
      setPopup(false);
      return;
    }
    const today = new Date().toISOString().split("T")[0];

    const newLeads = leads.filter((item) => {
      if (!item.scheduleddate) return false;
      const leadDate = new Date(item.scheduleddate).toISOString().split("T")[0];
      return leadDate === today;
    });
    setLeads(newLeads);
    setPopup(false);
  };

  return (
    <div className="schedule-body">
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
          Schedule
        </div>
      </div>

      <div className="search-area">
        <div className="schedule-search">
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
              className="leads-input"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </span>
        </div>
        <div
          className="search-menu"
          onClick={() => {
            setPopup(true);
          }}
        >
          <img src="./filter.png" alt="" />
        </div>
      </div>

      <div className="schedule-list">
        {leads.map((item, i) => (
          <div
            onClick={() => setSelected(item._id)}
            key={i}
            className={`schedule-card ${selected === item._id ? "active" : ""}`}
          >
            <div className="card-row">
              <div>
                <div className="card-title">{item.source}</div>
                <div className="card-sub">949-345-343</div>
              </div>
              <div className="card-date">
                <div className="date-text">Date</div>
                <div className="item-date">
                  {new Date(item.scheduleddate).toLocaleDateString() ===
                  "1/1/1970"
                    ? "-"
                    : new Date(item.scheduleddate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="card-bottom">
              <div className="call-row">
                <img
                  src={`./location-${item.active ? "white" : "black"}.png`}
                  alt=""
                />
                <span>Call</span>
              </div>
              <div className="name-row">
                <div
                  className={`short-name ${
                    selected === item._id ? "black-text" : ""
                  }`}
                >
                  {getInitials(item.name).toUpperCase()}
                </div>
                <div className="user-row">{item.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* popup */}
      {popup && (
        <div className="popup-overlay-schedule">
          <div className="filter-popup">
            <div className="filter-title">Filter</div>
            <div
              onClick={() => {
                setPopup("");
              }}
              className="cross"
            >
              X
            </div>
            <select
              className="select-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              name=""
              id=""
            >
              <option value="Today">Today</option>
              <option value="All">All</option>
            </select>
            <button className="save-b" onClick={handleFilter}>
              Save
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Schedule;
