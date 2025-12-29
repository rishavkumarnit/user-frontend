import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Loginpage from "./components/loginpage/Loginpage";
import Dashboard from "./components/dashboard/Dashboard";
import Leads from "./components/leads/Leads";
import Schedule from "./components/schedule/Schedule";
import Profile from "./components/profile/Profile";
import { createContext, useEffect, useState } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const Data = createContext();

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchedUser = localStorage.getItem("user");
    if (fetchedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(fetchedUser);
    }
  }, []);

  return (
    <Data.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Loginpage />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Loginpage />}
          />
          <Route path="/leads" element={user ? <Leads /> : <Loginpage />} />
          <Route
            path="/schedule"
            element={user ? <Schedule /> : <Loginpage />}
          />
          <Route path="/profile" element={user ? <Profile /> : <Loginpage />} />
        </Routes>
      </Router>
    </Data.Provider>
  );
}

export default App;
