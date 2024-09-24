import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Chat from './Chat.jsx';
import SideNav from './SideNav.jsx';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="app-container">
      {token && <SideNav />}
      <Routes>
        {!token ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/chat" element={<Chat />} />
          </>
        ) : (
          <>
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/chat" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;