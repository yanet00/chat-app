import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'https://chatify-api.up.railway.app';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getCSRFToken = async () => {
  try {
    const response = await axios.patch(`${BASE_URL}/csrf`);
    console.log('CSRF Token fetched:', response.data.csrfToken);
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};


export const fetchUsers = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Users fetched:', response.data);
    return response.data;
  } catch (error) {
    // Logga mer detaljerad information om felet
    if (error.response) {
      console.error('Error fetching users:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching users:', error.message);
    }
    throw error;
  }
};


export const fetchConversations = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Conversations fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};


export const fetchMessages = async (token, userId = null, conversationId = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId, conversationId },
    });
    console.log('Messages fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Invite a user to a conversation
export const inviteUserToConversation = async (token, userId, conversationId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/invite/${userId}`,
      { conversationId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('User invited to conversation:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error inviting user to conversation:', error.response?.status, error.message);
    throw error;
  }
};


export const createConversation = async (token, userId) => {
  try {
    
    const conversationId = uuidv4();

    const response = await axios.post(
      `${BASE_URL}/invite/${userId}`,
      { conversationId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Conversation created:', response.data);

    return { id: conversationId, message: response.data.message };
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};


export const sendMessage = async (message, conversationId, token, csrfToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/messages`,
      { text: message, conversationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


export const deleteMessage = async (msgId, token, csrfToken) => {
  try {
    await axios.delete(`${BASE_URL}/messages/${msgId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-Token': csrfToken,
      },
    });
    console.log('Message deleted:', msgId);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};


export const fetchUserById = async (userId, token) => {
  try {
    const response = await apiClient.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('User fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};


export const registerUser = async (username, password, csrfToken) => {
  try {
    const response = await apiClient.post('/auth/register', 
      { username, password },
      {
        headers: { 'X-CSRF-Token': csrfToken },
      }
    );
    console.log('User registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (username, password, csrfToken) => {
  try {
    const response = await apiClient.post('/auth/token', 
      { username, password },
      {
        headers: { 'X-CSRF-Token': csrfToken },
      }
    );
    console.log('User logged in:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const updateUser = async (userData, token, csrfToken) => {
  try {
    const response = await apiClient.put('/user', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-Token': csrfToken,
      },
    });
    console.log('User updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


export const deleteUserById = async (userId, token, csrfToken) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-Token': csrfToken,
      },
    });
    console.log('User deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const logoutUser = async (token, csrfToken) => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-Token': csrfToken,
      },
    });
    console.log('User logged out');
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};
