import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    backgroundColor: 'rgba(254, 250, 224, 0.95)',
    border: '1px solid rgba(40, 54, 24, 0.1)',
    borderRadius: '15px',
    padding: '25px',
    margin: '15px',
    width: '320px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    
    // --- THIS IS THE FIX ---
    // The transform and boxShadow are now defined conditionally in one place.
    // The duplicate boxShadow definition has been removed.
    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
    boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.2)' : '0 8px 16px rgba(0,0,0,0.15)',
  };

  const tripNameStyle = {
    margin: '0 0 10px 0',
    color: '#283618',
  };
  
  const dateStyle = {
    margin: 0,
    color: '#606c38',
    fontSize: '0.9rem',
  };

  return (
    <Link 
      to={`/trip/${trip.id}`} 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 style={tripNameStyle}>{trip.trip_name}</h3>
      <p style={dateStyle}>{trip.start_date} to {trip.end_date}</p>
    </Link>
  );
};

export default TripCard;