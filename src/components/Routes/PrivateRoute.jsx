import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types';
import LoadingSpinner from "../Utilities/LoadingSpinner";
import { useEffect } from "react";

const PrivateRoute = ({ children, role }) => {
    const { loading, user, fetchUserInfo, logout, roleVerified, setRoleVerified } = useAuth();
    const location = useLocation();

    const token = localStorage.getItem("access-token")

    useEffect(() => {
        const verifyRole = async () => {
            if (!token) {
                setRoleVerified(false);
                return;
            }

            try {
                const userData = await fetchUserInfo();
                if (userData && userData?.user_role === role) {
                    setRoleVerified(true);
                } else {
                    setRoleVerified(false);
                }
            } catch {
                setRoleVerified(false);
                logout();
            }
        }
        verifyRole();

    }, [fetchUserInfo, role, token, setRoleVerified, logout]);


    // Show loading spinner while fetching role or user info
    if (loading || roleVerified === null) return <LoadingSpinner />;

    if (!user && !token) {
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    if (role && roleVerified === false) {
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.any,
    role: PropTypes.string
}

export default PrivateRoute;