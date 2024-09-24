import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SideNav = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    setFeedback('');

    
    localStorage.clear();
    setFeedback('Logout successful. Redirecting to login...');
    navigate('/login', { replace: true });
    
    
    setLoading(false);
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
