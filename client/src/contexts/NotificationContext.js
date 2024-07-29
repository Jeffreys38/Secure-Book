import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
    /*
        1. alert: code, message (options)
        2. isActive: true: show, false: hide
    */
    const [alert, setAlert] = useState(false);
    const [isActive, setIsActive] = useState(null);

    const timeHiddenRef = useRef(3400) // miliseconds
    const alertFormRef = useRef()

    useEffect(() => {
        if (isActive) {
            setTimeout(() => {
                alertFormRef.current.classList.replace("d-block", "d-none")
                setIsActive(false)

            }, timeHiddenRef.current)
        }
    }, [isActive])

    const alertClass = (alert.code === 200) ? "success" : "failed";

    return (
        <NotificationContext.Provider value={{
            setAlert,
            setIsActive
        }}>
            {children}
            <div ref={alertFormRef} id="alertForm" className={`${(isActive) ? "d-block" : "d-none"} ${alertClass}`}>
                <p>{alert.message}</p>
            </div>
        </NotificationContext.Provider>
    )
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  return context;
};
