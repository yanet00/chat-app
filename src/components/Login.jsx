import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCSRFToken } from '../utils/fetchCSRFToken';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    try {
      const csrfToken = await fetchCSRFToken();
      const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username,
          avatar: data.avatar,
        }));

        // Logga in framgång och navigera till Chat
        console.log('Login successful. Token:', localStorage.getItem('token'));
        
        // Navigera till Chat efter att ha lagrat token
        navigate('/Chat', { replace: true }); // Använd replace för att förhindra att gå tillbaka till login
      } else {
        setFeedback(data.message || 'Invalid credentials.');
      }
    } catch (error) {
      setFeedback('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="nav-bar">
        <h1>Yapster</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default Login;
