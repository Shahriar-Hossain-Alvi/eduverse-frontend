import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types';
import LoadingSpinner from "../Utilities/LoadingSpinner";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, role }) => {
    const { loading, user, fetchUserInfo, logout, roleVerified, setRoleVerified } = useAuth();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(true); // New state to track verification status
    // const [localRoleVerified, setLocalRoleVerified] = useState(null);
    const token = localStorage.getItem("access-token")

    useEffect(() => {
        const verifyRole = async () => {
            if (!token) {
                setRoleVerified(false);
                setIsVerifying(false);
                return;
            }

            if (!user) {
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
                    localStorage.removeItem("access-token");
                    logout();
                } finally {
                    setIsVerifying(false);
                }
            }else{
                setRoleVerified(user?.user_role === role);
                setIsVerifying(false);
            }


        }
        verifyRole();

    }, [fetchUserInfo, role, token, setRoleVerified, logout, user]);


    // Show loading spinner while fetching role or user info
    if (loading || isVerifying || roleVerified === null) return <LoadingSpinner />;

    if (!user && !token) {
        console.log("Go to sign in from private route line 46");
        //logout(); // newly added to check
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    if (role && roleVerified === false) {
        console.log("Go to sign in from private route line 52");
        //logout(); // newly added to check
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.any,
    role: PropTypes.string
}

export default PrivateRoute;