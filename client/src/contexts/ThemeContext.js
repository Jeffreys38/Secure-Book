import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

/**
 * Cấu hình style cho ứng dụng (ở đây)
 * @param {*} param0 
 * @returns 
 */
export const ThemeProvider = ({ children }) => {
    const themes = {
        default: {
            button: {
              backgroundColor: "black",
              color: "white"
            },
            app: {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            }
        },
        dark: {

        }
    };

    const [theme, setTheme] = useState('default');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'default' ? 'dark' : 'default'));
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeObject: themes[theme] }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
