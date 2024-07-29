import React, { createContext, useContext, useEffect, useState } from 'react';
import socket from '../socket/socket-client.js';

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      socket.emit('add-user', user._id)
    }
  }, [user])

  return (
    <UserContext.Provider value={{
      user,
      setUser,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  
  return context;
};
