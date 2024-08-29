import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCSRFToken, loginUser } from '../utils/api.js';

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
      console.log('Attempting to fetch CSRF token...');
      const csrfToken = await getCSRFToken();
      console.log('CSRF token fetched successfully:', csrfToken);

      console.log('Attempting to login with username:', username);
      const response = await loginUser(username, password, csrfToken);

      if (response && response.token) {
        console.log('Login successful. Storing token and user data.');
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          username: response.username,
          avatar: response.avatar,
        }));

        console.log('Navigating to chat page...');
        navigate('/chat', { replace: true });
      } else {
        console.warn('Login failed. No token received.');
        setFeedback('Invalid credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setFeedback('Login failed. Please try again.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  const goToRegister = () => {
    console.log('Navigating to register page...');
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
      
      <div className="register-link">
        <p>Don't have an account?</p>
        <button onClick={goToRegister}>Register Here</button>
      </div>
    </div>
  );
};

export default Login;
