import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import useAxiosPublic from "../Hooks/useAxiosPublic";


export const AuthContext = createContext(null);


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    // login user
    const login = async (email, password) => {
        try {
            const logInData = { email, password }
            const result = await axiosPublic.post("/users/login", logInData);

            // save user data in LS
            localStorage.setItem("user", JSON.stringify(result?.data.data));

            // save access token in LS
            localStorage.setItem("access-token", result.data.token);

            const userData = result?.data.data;

            setUser(userData);
            setLoading(false);

            return userData;
        } catch (error) {
            console.log("Login failed ", error);
            setLoading(false);
            throw new Error(error?.response?.data?.message)
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        // Auto-login if user data exists in localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);


    const authInfo = {
        user,
        loading,
        setLoading,
        login
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
}

export default AuthProvider;