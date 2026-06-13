import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '', username: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const url = 'http://127.0.0.1:8000/api/auth/user/';
        const config = { headers: { 'Authorization': `Token ${token}` } };
        const res = await axios.get(url, config);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [navigate]);

  const onChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const url = 'http://127.0.0.1:8000/api/auth/user/';
      const config = { headers: { 'Authorization': `Token ${token}` } };
      const payload = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email
      };
      const res = await axios.patch(url, payload, config);
      onProfileUpdate(res.data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Failed to update profile", error.response.data);
      setMessage('Failed to update profile. Please try again.');
    }
  };

  // --- Styles ---
  const pageContainerStyle = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: 'calc(100vh - 70px)', 
    padding: '20px',
    // Subtler gradient overlay
    backgroundImage: `linear-gradient(rgba(40, 54, 24, 0.5), rgba(40, 54, 24, 0.5)), url('https://images.pexels.com/photos/4639198/pexels-photo-4639198.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };
 const formStyle = { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '500px', padding: '40px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', borderRadius: '15px', backgroundColor: '#ffffff' }; // Solid white for contrast
  // ... (rest of the styles are the same)
  const profileIconContainer = { textAlign: 'center', marginBottom: '20px' };
  const nameContainerStyle = { display: 'flex', gap: '20px' };
  const inputGroup = { flex: '1', display: 'flex', flexDirection: 'column' };
  const labelStyle = { marginBottom: '5px', fontWeight: '500', color: '#606c38' };
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', color: '#283618', marginBottom: '15px' };
  const buttonStyle = { padding: '15px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #283618, #606c38)', color: '#fefae0', cursor: 'pointer', marginTop: '20px', fontSize: '1.1rem', fontWeight: 'bold' };
  const messageStyle = { textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: message.includes('Failed') ? '#bc6c25' : '#606c38' };

  return (
    <div style={pageContainerStyle}>
      <div style={formStyle}>
        <div style={profileIconContainer}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#283618" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#283618' }}>Manage Your Profile</h2>
        <form onSubmit={onSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Username</label>
            <input type="text" value={profile.username || ''} style={{...inputStyle, backgroundColor: '#f4f4f4'}} readOnly />
          </div>
          <div style={nameContainerStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>First Name</label>
              <input type="text" name="first_name" value={profile.first_name || ''} onChange={onChange} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Last Name</label>
              <input type="text" name="last_name" value={profile.last_name || ''} onChange={onChange} style={inputStyle} />
            </div>
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={profile.email || ''} onChange={onChange} style={inputStyle} required />
          </div>
          <button type="submit" style={buttonStyle}>Save Changes</button>
          {message && <p style={messageStyle}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;