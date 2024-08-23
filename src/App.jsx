import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import SideNav from './components/SideNav';
import './styles/App.css';

function App() {
  let token = localStorage.getItem('token');

  console.log('Token:', token); // Debugging output

  return (
    <Router>
      <div className="app">
        {token && <SideNav />}
        <div className="main-content">
          <Routes>
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/Chat" />} />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/Chat" />} />
            <Route
              path="/Chat"
              element={token ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={token ? <Navigate to="/Chat" /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to={token ? "/Chat" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
