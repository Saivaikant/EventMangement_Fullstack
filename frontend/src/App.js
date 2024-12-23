import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventManagement from "./components/EventManagement";
import AttendeeManagement from "./components/AttendeeManagement";
import TaskTracker from "./components/TaskTracker";
import NavigationBar from "./components/Navbar";

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<EventManagement />} />
          <Route path="/attendees" element={<AttendeeManagement />} />
          <Route path="/tasks" element={<TaskTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
