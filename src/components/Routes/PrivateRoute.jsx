import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types';
import LoadingSpinner from "../Utilities/LoadingSpinner";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, role }) => {
    const { loading, user, fetchUserInfo, logout, roleVerified, setRoleVerified } = useAuth();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(true); // New state to track verification status
    const token = localStorage.getItem("access-token")

    useEffect(() => {
        const verifyRole = async () => {
            if (!token) {
                setRoleVerified(false);
                setIsVerifying(false);
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
                console.log("logging out from Private route line 29");
                logout();
            }finally{
                setIsVerifying(false);
            }
        }
        verifyRole();

    }, [fetchUserInfo, role, token, setRoleVerified, logout]);


    // Show loading spinner while fetching role or user info
    if (loading || isVerifying || roleVerified === null) return <LoadingSpinner />;

    if (!user && !token) {
        console.log("Go to sign in  from private route line 42");
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    if (role && roleVerified === false) {
        console.log("Go to sign in from private route line 47");
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.any,
    role: PropTypes.string
}

export default PrivateRoute;