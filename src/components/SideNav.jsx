import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="side-nav">
      <div className="user-info">
        <img src={user.avatar} alt={`${user.username}'s avatar`} />
        <p>{user.username}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SideNav;
