import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import useAxiosPublic from "../Hooks/useAxiosPublic";


export const AuthContext = createContext(null);


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    console.log(user);

    // login user and save token in LS
    const login = async (email, password) => {
        try {
            const logInData = { email, password };
            const result = await axiosPublic.post("/users/login", logInData);

            // Save access token only
            localStorage.setItem("access-token", result.data.token);

            // Fetch user info securely using the fetchUserInfo function
            const userData = await fetchUserInfo();

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

    // fetch user data securely after successful login
    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await axiosPublic("/users/me");
            return response.data.data; // Returns the full user object from the backend
        } catch (error) {
            console.error("Error fetching user info:", error);
            logout();
            throw error;
        }
    }, [axiosPublic])


    // Auto-login if token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem("access-token");
        if (token) {
            fetchUserInfo().then((data) => {
                setUser(data);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [fetchUserInfo]);



    // logout user remover from LS and set user to null in the state
    const logout = () => {
        localStorage.removeItem("access-token");
        setUser(null);
        setLoading(false);
    };


    const authInfo = {
        user,
        loading,
        setLoading,
        login,
        logout,
        fetchUserInfo
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