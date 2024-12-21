import { useContext } from "react";
import { ThemeContext } from "../Provider/ThemeProvider";



const useAuth = () => {
    const theme = useContext(ThemeContext);
    return theme;
};

export default useAuth;