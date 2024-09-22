import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCSRFToken,
  fetchUsers,
  fetchConversations,
  fetchMessages,
  sendMessage,
  deleteMessage,
  createConversation,
} from "../utils/api.js";
import DOMPurify from "dompurify";
import chatData from './chat.json'; 

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login...");
      navigate("/login", { replace: true });
    } else {
      console.log("Token found, loading users and conversations...");
      loadUsers(token);
      loadConversations(token);
    }
  }, [navigate]);

  const loadUsers = async (token) => {
    try {
      const fetchedUsers = await fetchUsers(token);
      setUsers(fetchedUsers);
    } catch (error) {
      handleFetchError(error, "users");
    }
  };

  const loadConversations = async (token) => {
    try {
      const fetchedConversations = await fetchConversations(token);
      setConversations(fetchedConversations);
    } catch (error) {
      handleFetchError(error, "conversations");
    }
  };

  const loadMessages = async (userId, conversationId) => {
    if (!userId || !conversationId) {
      
      setMessages(chatData);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const fetchedMessages = await fetchMessages(token, userId, conversationId);
      setMessages(fetchedMessages);
    } catch (error) {
      setFeedback("Failed to load messages.");
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);

    let conversation = conversations.find(
      (conv) =>
        (conv.userId === loggedInUser.id && conv.otherUserId === user.userId) ||
        (conv.userId === user.userId && conv.otherUserId === loggedInUser.id)
    );

    if (!conversation) {
      try {
        console.log("No existing conversation, starting a new one...");
        const token = localStorage.getItem("token");
        const newConversation = await createConversation(token, user.userId);

        conversation = {
          id: newConversation.conversationId,
          userId: loggedInUser.id,
          otherUserId: user.userId,
        };

        setConversations([...conversations, conversation]);
      } catch (error) {
        setFeedback("Failed to create new conversation.");
        console.error("Error creating conversation:", error);
        return;
      }
    }

    loadMessages(user.userId, conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
        setFeedback("Message cannot be empty.");
        return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
        const csrfToken = await getCSRFToken();
        const sanitizedMessage = DOMPurify.sanitize(newMessage.trim());

        const conversation = conversations.find(
            (conv) =>
                (conv.userId === loggedInUser.id &&
                    conv.otherUserId === selectedUser.userId) ||
                (conv.userId === selectedUser.userId &&
                    conv.otherUserId === loggedInUser.id)
        );

        if (!conversation) {
            setFeedback("No valid conversation found.");
            setLoading(false);
            return;
        }

        const newMsg = await sendMessage(
            sanitizedMessage,
            conversation.id,
            token,
            csrfToken
        );

        if (newMsg && newMsg.latestMessage) {
            
            setMessages((prevMessages) => [
                ...prevMessages, 
                newMsg.latestMessage 
            ]);
            setNewMessage(""); 
            setFeedback("Message sent successfully.");
        } else {
            setFeedback("Failed to send message, unexpected response format.");
        }
    } catch (error) {
        setFeedback("Failed to send message.");
        console.error(
            "Error sending message:",
            error.response || error.message || error
        );
    } finally {
        setLoading(false);
    }
};

  const handleDeleteMessage = async (msgId) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const csrfToken = await getCSRFToken();
      await deleteMessage(msgId, token, csrfToken);
      setMessages(messages.filter((message) => message.id !== msgId));
      setFeedback("Message deleted successfully.");
    } catch (error) {
      setFeedback("Failed to delete message.");
      console.error("Error deleting message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (error, resourceType) => {
    if (error.response && error.response.status === 403) {
      setFeedback(
        `Access denied. Please log in again to fetch ${resourceType}.`
      );
      navigate("/login", { replace: true });
    } else {
      setFeedback(`Failed to load ${resourceType}.`);
    }
  };

  return (
    <div className="chat-app">
      <div className="user-list">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.userId}
              onClick={() => handleUserSelect(user)}
              className={`user-item ${
                user.userId === selectedUser?.userId ? "selected" : ""
              }`}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-container">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>
            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.userId === loggedInUser.id ? "right" : "left"
                  }`}
                >
                  <strong>
                    {message.userId === loggedInUser.id
                      ? "You"
                      : selectedUser.username}
                  </strong>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(message.text),
                    }}
                  />
                  {message.userId === loggedInUser.id && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="delete-button"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="message-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={handleSendMessage} disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default Chat;
