import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const navStyle = {
    backgroundColor: 'rgba(254, 250, 224, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '15px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e0e0e0',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  };

  const logoStyle = { textDecoration: 'none', color: '#283618', fontWeight: 'bold', fontSize: '1.5rem' };
  const navLinksStyle = { display: 'flex', gap: '25px', alignItems: 'center' };
  const linkStyle = { textDecoration: 'none', color: '#606c38', fontWeight: '500' };
  const buttonLinkStyle = { ...linkStyle, backgroundColor: '#dda15e', color: '#fefae0', padding: '8px 15px', borderRadius: '8px' };
  const logoutButtonStyle = { background: 'none', border: 'none', color: '#bc6c25', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', padding: 0 };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>Travel Partner</Link>
      <div style={navLinksStyle}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            {/* NEW: Display user's name as the link to the profile */}
            <Link to="/profile" style={linkStyle}>
              Hi, {user ? (user.first_name || user.username) : 'User'}
            </Link>
            <button onClick={onLogout} style={logoutButtonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={buttonLinkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;