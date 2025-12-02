import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../features/home/pages/Home";
import Feed from "../features/feed/pages/Feed";
import Users from "../features/users/pages/Users";
import Requests from "../features/requests/pages/Requests";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import "./AppLayout.css";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Navbar />
        <div className="app-layout">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/users" element={<Users />} />
            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;

