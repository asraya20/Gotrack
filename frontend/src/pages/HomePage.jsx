import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const heroStyle = {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fefae0', // --cornsilk for light text
    textAlign: 'center',
    backgroundImage: `linear-gradient(rgba(40, 54, 24, 0.6), rgba(40, 54, 24, 0.6)), url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const titleStyle = { fontSize: '4rem', fontWeight: 'bold', margin: 0, textShadow: '2px 2px 8px rgba(0,0,0,0.7)' };
  const subtitleStyle = { fontSize: '1.5rem', marginTop: '10px', maxWidth: '600px' };
  
  const ctaButtonStyle = {
    marginTop: '30px',
    padding: '15px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#283618', // --pakistan-green for dark text
    backgroundColor: '#dda15e', // --earth-yellow
    border: 'none',
    borderRadius: '10px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  };

  return (
    <div style={heroStyle}>
      <h1 style={titleStyle}>Welcome to Travel Partner</h1>
      <p style={subtitleStyle}>Your journey, perfectly planned. Create, manage, and share your travel itineraries with ease.</p>
      <Link to="/register" style={ctaButtonStyle} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
        Get Started
      </Link>
    </div>
  );
};

export default HomePage;