import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/UserContext.js';
import socket from "../socket/socket-client.js"
import UserService from '../services/user.service.js';

// PrivateRoute sẽ kiểm tra tính hợp lệ của token
const PrivateRoute = () => {
  const [isTokenValid, setIsTokenValid] = useState(null);
  const { setUser } = useUserContext();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      const userId = localStorage.getItem('userId');
      fetchData(userId)
    } else {
      setIsTokenValid(false)
    }

    socket.on('auth', (token) => {
    
    });

    return () => {
      socket.off('auth')
    }
  }, []);

  const fetchData = async (userId) => {
    try {
      const response = await UserService.getUser(userId);

      if (response.code === 200) {
        setUser(response.data);
        setIsTokenValid(true)
      } else if (response.code === 400) {
        setIsTokenValid(false)
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  if (isTokenValid === null) {
    return null;
  }
  return isTokenValid ? <Outlet /> : <Navigate to="/login" />
};

export default PrivateRoute;
