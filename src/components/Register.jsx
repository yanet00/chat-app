import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null); 
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    try {
      console.log('Attempting to fetch CSRF token...');
      const csrfResponse = await axios.patch('https://chatify-api.up.railway.app/csrf');
      const csrfToken = csrfResponse.data.csrfToken;
      console.log('CSRF token fetched successfully:', csrfToken);

      console.log('Attempting to register with username:', username, 'and email:', email);
      const response = await axios.post('https://chatify-api.up.railway.app/auth/register', 
        { username, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
        }
      );

      console.log('Server response:', response);

      if (response.status === 200 || response.status === 201) {
        console.log('Registration successful:', response.data);
        setFeedback('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } else {
        console.warn('Unexpected response status:', response.status);
        setFeedback('Unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      setFeedback(error.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type='file'
          accept="image/*" 
          onChange={handleImageChange}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default Register;
