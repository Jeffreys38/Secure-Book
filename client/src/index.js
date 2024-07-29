import React from 'react';
import App from './App.js';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals.js';
import { ModalProvider } from "./contexts/ModalContext.js"
import { AudioProvider } from "./contexts/AudioContext.js";
import { ThemeProvider } from "./contexts/ThemeContext.js";
import { UserProvider } from "./contexts/UserContext.js";
import { NotificationProvider } from './contexts/NotificationContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <NotificationProvider>
    <UserProvider>
    <AudioProvider>
    <ThemeProvider>
    <ModalProvider>
        <App />
        {/* modal here */}
    </ModalProvider>
    </ThemeProvider>
    </AudioProvider>
    </UserProvider>
    </NotificationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
