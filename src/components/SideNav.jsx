import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getCSRFToken } from '../utils/api';

const SideNav = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(''); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setFeedback(''); 

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      console.error('User or token not found in localStorage.');
      setFeedback('User not logged in.');
      setLoading(false);
      return;
    }

    try {
      const csrfToken = await getCSRFToken();
      await logoutUser(token, csrfToken);
      localStorage.clear();
      setFeedback('Logout successful. Redirecting to login...');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error);
      setFeedback('Logout failed. Please try again.'); 
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));


  if (!user) {
    return <p>No user information available.</p>;
  }

  return (
    <div className="side-nav">
      <div className="user-info">
        {user.avatar ? (
          <img src={user.avatar} alt={`${user.username}'s avatar`} />
        ) : (
          <div className="default-avatar">No Avatar</div> 
        )}
        <p>{user.username}</p>
      </div>
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {feedback && <p className="feedback">{feedback}</p>} 
    </div>
  );
};

export default SideNav;
