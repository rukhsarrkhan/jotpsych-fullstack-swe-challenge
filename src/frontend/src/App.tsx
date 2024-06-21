import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import APIService from "./services/APIService";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  const [appVersion, setAppVersion] = useState<string>("1.0.0");

  useEffect(() => {
    APIService.getInstance(setAppVersion);
  }, []);

  // Mock updating the app version after some user interaction
  const handleUpdateVersion = () => {
    setAppVersion("1.2.0");
    APIService.getInstance().appVersion = "1.2.0";
  };

  return (
    <div>
      <button onClick={handleUpdateVersion}>Update App Version</button>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/audio" element={<AudioRecorder />} />
      </Routes>
    </div>
  );
}

export default App;
