import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types';
import LoadingSpinner from "../Utilities/LoadingSpinner";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, role }) => {
    const { loading, user, fetchUserInfo, logout } = useAuth();
    const location = useLocation()
    const [roleVerified, setRoleVerified] = useState(null);

    const token = localStorage.getItem("access-token")

    useEffect(() => {
        if (token) {
            fetchUserInfo()
                .then((userData) => {
                    // If userData is valid and matches the required role
                    if (userData && userData.user_role === role) {
                        setRoleVerified(true);
                    } else {
                        setRoleVerified(false);
                    }
                })
                .catch(() => {
                    // If the user cannot be fetched (token expired, invalid, etc.)
                    setRoleVerified(false);
                    logout();
                });
        }
        else {
            setRoleVerified(false);
        }
    }, [fetchUserInfo, role, token, logout]);

    // Show loading spinner while fetching role or user info
    if (loading || roleVerified === null) return <LoadingSpinner />;

    if (!user && !token){
        return <Navigate to="/signin" state={{ from: location }} />;
    } 

    if (role && roleVerified === false) {
        logout();
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.any,
    role: PropTypes.string
}

export default PrivateRoute;