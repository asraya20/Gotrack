import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import NewTripModal from '../components/NewTripModal';

const DashboardPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const tripsUrl = 'http://127.0.0.1:8000/api/trips/';
        const config = { headers: { 'Authorization': `Token ${token}` } };
        const res = await axios.get(tripsUrl, config);
        setTrips(res.data);
      } catch (err) {
        setError('Failed to load trips. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleTripCreated = (newTrip) => setTrips([...trips, newTrip]);

  const containerStyle = { 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: 'calc(100vh - 70px)',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.pexels.com/photos/706448/pexels-photo-706448.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };
  const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px 40px',
    backgroundColor: 'transparent',
    color: '#ffffff'
  };
  const tripsContainerStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' };
  const logoutButtonStyle = { padding: '10px 20px', borderRadius: '8px', border: '1px solid #ffffff', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background-color 0.2s ease' };
  const addTripButtonStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #dda15e, #bc6c25)', color: '#fefae0', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };
  
  // Themed styles for loading/error/empty messages
  const messageBoxStyle = {
    marginTop: '50px',
    color: '#ffffff',
    backgroundColor: 'rgba(40, 54, 24, 0.7)', // Semi-transparent --pakistan-green
    backdropFilter: 'blur(5px)',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
  };

  if (loading) return <div style={containerStyle}><div style={{...messageBoxStyle, margin: '50px auto', width: '300px'}}><h2>Loading your trips...</h2></div></div>;
  if (error) return <div style={containerStyle}><div style={{...messageBoxStyle, margin: '50px auto', width: '500px', color: '#ffdddd'}}><h2>{error}</h2></div></div>;

  return (
    <div style={containerStyle}>
      <NewTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTripCreated={handleTripCreated} />
      
      <div style={headerStyle}>
        <h1 style={{color: '#ffffff', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>My Trips</h1>
        <div>
          <button style={addTripButtonStyle} onClick={() => setIsModalOpen(true)}>+ New Trip</button>
          <button onClick={handleLogout} style={{...logoutButtonStyle, marginLeft: '10px'}} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>Logout</button>
        </div>
      </div>

      <div style={tripsContainerStyle}>
        {trips.length > 0 ? (
          trips.map(trip => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <div style={messageBoxStyle}>
            <h2>Your adventure awaits!</h2>
            <p>You haven't created any trips yet. Click "+ New Trip" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;