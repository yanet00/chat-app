import React from 'react';
import { useNavigate } from 'react-router-dom';

const SideNav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Utloggningsfunktionen
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Omdirigera användaren till inloggningssidan efter utloggning
  };

  return (
    <div className="sidenav">
      <div className="user-info">
        {/* Kontrollera att användardata finns innan rendering */}
        {user ? (
          <>
            <img
              src={user.avatar || 'default-avatar.png'} // Använd en standardbild om ingen bild finns
              alt={user.username || 'User Avatar'} // Alt-text för tillgänglighet
              className="avatar"
            />
            <h3>{user.username || 'Guest'}</h3>
          </>
        ) : (
          <p>No user information available</p>
        )}
      </div>
      {/* Logout-knapp */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default SideNav;
