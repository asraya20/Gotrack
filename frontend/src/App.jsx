import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null); // <-- NEW: State to hold user data

  // Fetch user data if logged in when the app loads
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        try {
          const config = { headers: { 'Authorization': `Token ${token}` } };
          const res = await axios.get('http://127.0.0.1:8000/api/auth/user/', config);
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user on load", error);
          handleLogout(); // Log out if token is invalid
        }
      }
    };
    fetchUser();
  }, []);

  const handleLoginSuccess = async (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    // Fetch user data immediately after login
    try {
        const config = { headers: { 'Authorization': `Token ${token}` } };
        const res = await axios.get('http://127.0.0.1:8000/api/auth/user/', config);
        setUser(res.data);
    } catch (error) {
        console.error("Failed to fetch user after login", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/login';
  };
  
  // NEW: This function will be called from the ProfilePage
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      {/* Pass user data and logout handler to the Navbar */}
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      
      <main style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trip/:tripId" element={<ItineraryDetailPage />} />
          {/* Pass the update handler to the ProfilePage */}
          <Route path="/profile" element={<ProfilePage onProfileUpdate={handleProfileUpdate} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;