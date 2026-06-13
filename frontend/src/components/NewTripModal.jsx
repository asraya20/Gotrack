import React, { useState } from 'react';
import axios from 'axios';

const NewTripModal = ({ isOpen, onClose, onTripCreated }) => {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be before the start date.');
      return;
    }

    const token = localStorage.getItem('token');
    const newTripData = {
      trip_name: tripName,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const url = 'http://127.0.0.1:8000/api/trips/';
      const config = { headers: { 'Authorization': `Token ${token}` } };
      const res = await axios.post(url, newTripData, config);
      
      onTripCreated(res.data); // This updates the dashboard's state
      onClose(); // This closes the modal
    } catch (err) {
      console.error('Failed to create trip:', err.response.data);
      setError('Failed to create trip. Please try again.');
    }
  };

  if (!isOpen) return null;

  // --- Styles ---
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };
  const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };
  const buttonStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
  const createButtonStyle = { ...buttonStyle, backgroundColor: '#007bff', color: 'white' };
  const cancelButtonStyle = { ...buttonStyle, backgroundColor: '#6c757d', color: 'white' };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{marginTop: 0}}>Create a New Trip</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Trip Name (e.g., Ooty Adventure)" value={tripName} onChange={e => setTripName(e.target.value)} style={inputStyle} required />
          <div>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} required />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={createButtonStyle}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTripModal;