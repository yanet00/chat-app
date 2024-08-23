// src/utils/fetchCSRFToken.js
export const fetchCSRFToken = async () => {
    try {
      const response = await fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
  
      const data = await response.json();
      return data.csrfToken; // Returnera CSRF-token
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null; // Om det inte går att hämta token
    }
  };
  