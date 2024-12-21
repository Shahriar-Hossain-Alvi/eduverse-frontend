import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

// Create the context
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    // Save theme to localStorage and update the body's class name
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme; 
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


ThemeProvider.propTypes = {
    children: PropTypes.node
}

export default ThemeProvider; 
