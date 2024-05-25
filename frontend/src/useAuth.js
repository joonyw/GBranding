import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/is_logged_in', { withCredentials: true });
        setIsAuthenticated(response.data.logged_in);
        setIsAdmin(response.data.admin);
      } catch (error) {
        console.error('Error checking authentication status', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isAdmin, loading };
}

export default useAuth;
