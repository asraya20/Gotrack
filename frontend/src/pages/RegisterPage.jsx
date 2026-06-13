import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password1: '', password2: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { username, email, password1, password2 } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password1 !== password2) { setMessage('Passwords do not match'); return; }
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/registration/', { username, email, password1, password2 });
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        let errorMessages = [];
        for (const key in err.response.data) {
          errorMessages.push(`${key}: ${err.response.data[key].join(' ')}`);
        }
        setMessage(`Registration failed: ${errorMessages.join(' | ')}`);
      } else {
        setMessage('Registration failed: An unknown error occurred.');
      }
    }
  };

  const formContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', backgroundImage: `linear-gradient(rgba(40, 54, 24, 0.5), rgba(40, 54, 24, 0.5)), url('https://images.pexels.com/photos/31986010/pexels-photo-31986010.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' };
  const formStyle = { display: 'flex', flexDirection: 'column', width: '350px', padding: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', borderRadius: '15px', backgroundColor: '#ffffff' };
  const inputStyle = { margin: '10px 0', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', color: '#283618' };
  const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #283618, #606c38)', color: '#fefae0', cursor: 'pointer', marginTop: '10px', fontSize: '1rem', fontWeight: 'bold' };
  const messageStyle = { textAlign: 'center', marginTop: '15px', fontWeight: '500', color: '#bc6c25' };
  const linkContainerStyle = { textAlign: 'center', marginTop: '20px', color: '#606c38' };

  return (
    <div style={formContainerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#283618' }}>Create an Account</h2>
        <form onSubmit={onSubmit}>
          <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} style={inputStyle} required />
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} style={inputStyle} required />
          <input type="password" placeholder="Password" name="password1" value={password1} onChange={onChange} style={inputStyle} minLength="6" required />
          <input type="password" placeholder="Confirm Password" name="password2" value={password2} onChange={onChange} style={inputStyle} minLength="6" required />
          <button type="submit" style={buttonStyle}>Register</button>
          {message && <p style={messageStyle}>{message}</p>}
        </form>
         <div style={linkContainerStyle}>
            <p>Already have an account? <Link to="/login" style={{color: '#bc6c25', fontWeight: 'bold'}}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;