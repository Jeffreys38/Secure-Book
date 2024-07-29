import React, { createContext, useContext, useState } from 'react';

const MessagerContext = createContext();

export const MessengerProvider = ({ children }) => {
    const [messenger, setMessenger] = useState(null);

    return (
        <MessagerContext.Provider value={{ messenger, setMessenger }}>
            {children}
        </MessagerContext.Provider>
    );
};

export const useMessenger = () => {
  return useContext(MessagerContext);
};
