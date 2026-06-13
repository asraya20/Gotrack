import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ExpenseTracker from '../components/ExpenseTracker';
import Checklist from '../components/Checklist';
import ItineraryTimeline from '../components/ItineraryTimeline';

const ItineraryDetailPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTripDetails = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const url = `http://127.0.0.1:8000/api/trips/${tripId}/`;
      const config = { headers: { 'Authorization': `Token ${token}` } };
      const res = await axios.get(url, config);
      setTrip(res.data);
    } catch (error) {
      console.error("Failed to fetch trip details", error);
    } finally {
      setLoading(false);
    }
  }, [tripId, navigate]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const containerStyle = { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px', minHeight: '100vh', color: '#283618' };
  const headerStyle = { textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px', backgroundImage: `linear-gradient(to top, rgba(254, 250, 224, 0), rgba(254, 250, 224, 1)), linear-gradient(to right, #606c38, #283618)`, padding: '40px 20px', borderRadius: '12px', color: '#fefae0' };
  const backLinkStyle = { display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#606c38', fontWeight: 'bold' };
  const contentGridStyle = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' };

  if (loading || !trip) return <p style={{color: '#283618', textAlign: 'center', padding: '50px'}}>Loading itinerary...</p>;

  return (
    <div style={containerStyle}>
      <Link to="/dashboard" style={backLinkStyle}>&larr; Back to Dashboard</Link>
      <div style={headerStyle}>
        <h1 style={{ margin: 0 }}>{trip.trip_name}</h1>
        <p style={{ color: '#fefae0', fontSize: '1.2rem', margin: '10px 0 0 0' }}>{trip.start_date} to {trip.end_date}</p>
      </div>
      <div style={contentGridStyle}>
        <div>
          {/* We now pass the re-fetch function as a prop */}
          <ItineraryTimeline trip={trip} onUpdate={fetchTripDetails} />
        </div>
        <div>
          <ExpenseTracker tripId={trip.id} initialExpenses={trip.expenses || []} />
          <Checklist tripId={trip.id} initialTasks={trip.checklists || []} />
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetailPage;