import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCSRFToken } from '../utils/fetchCSRFToken'; // Importera funktionen

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Förhindra att formuläret skickar om sidan
    setLoading(true); // Visa laddningsindikator
    setFeedback('');

    // Hämta CSRF-token
    const csrfToken = await fetchCSRFToken();

    if (!csrfToken) {
      setFeedback('Failed to fetch CSRF token.');
      setLoading(false);
      return;
    }

    try {
      // Skicka POST-begäran till registrerings-API:et
      const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Vi skickar JSON-data
          'X-CSRF-Token': csrfToken, // Skicka CSRF-token i headern
        },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }), // Skicka registreringsdata som JSON
      });

      const data = await response.json();
      setLoading(false); // Avsluta laddning

      if (!response.ok) {
        setFeedback(data.message || 'An error occurred.');
      } else {
        setFeedback('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setFeedback('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="nav-bar">
        <h1>Yapster</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())} // Sanera inmatning
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())} // Sanera inmatning
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>} {/* Visa feedback till användaren */}
    </div>
  );
};

export default Register;
