import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.patch('https://chatify-api.up.railway.app/csrf');
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('https://chatify-api.up.railway.app/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      setFeedback('Error fetching users.');
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (chatWithUserId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`https://chatify-api.up.railway.app/messages?chatWith=${chatWithUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessages(response.data);
    } catch (error) {
      setFeedback('Error fetching messages.');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) {
      setFeedback('Select a user to chat with and enter a message.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const csrfToken = await fetchCsrfToken();
      const sanitizedMessage = DOMPurify.sanitize(newMessage.trim());

      const response = await axios.post('https://chatify-api.up.railway.app/messages', { 
        text: sanitizedMessage, 
        recipientId: selectedUser.id 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
      });

      setMessages([...messages, response.data]); 
      setNewMessage('');
    } catch (error) {
      setFeedback('Error sending message.');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const csrfToken = await fetchCsrfToken();

      const response = await axios.delete(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
      });

      console.log('Delete Response:', response.data);

      if (response.status === 200) {
        setMessages(messages.filter((message) => message.id !== messageId));
        setFeedback('Message deleted successfully.');
      } else {
        setFeedback('Failed to delete the message.');
      }
    } catch (error) {
      console.error('Error deleting message:', error.response || error.message);
      setFeedback('Error deleting message.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  return (
    <div className="chat-app">
      <div className="user-list">
        <h2>Users</h2>
        <ul>
          {users.map((u) => (
            <li key={u.id} onClick={() => handleUserSelect(u)} className={`user-item ${u.id === selectedUser?.id ? 'selected' : ''}`}>
              {u.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-container">
        {selectedUser && (
          <>
            <div className="chat-header">
              <h3>Chatting with {selectedUser.username}</h3>
            </div>

            <div className="messages">
              {loading && <p>Loading messages...</p>}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.userId === user.id ? 'right' : 'left'}`}
                >
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.text) }} />
                  {/* Always show the delete button */}
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="new-message">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={handleSendMessage} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}

        {!selectedUser && <p>Please select a user to start chatting.</p>}
        {feedback && <p className="feedback">{feedback}</p>}
      </div>
    </div>
  );
};

export default Chat;
