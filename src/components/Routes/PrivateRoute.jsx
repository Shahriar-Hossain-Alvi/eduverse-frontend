import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types';
import LoadingSpinner from "../Utilities/LoadingSpinner";

const PrivateRoute = ({ children, role }) => {
    const { loading, user } = useAuth();
    const location = useLocation()
    

    if (loading) return <LoadingSpinner />

    if (!user) return <Navigate to="/signin" state={{ from: location }}></Navigate>


    if (role && user.user_role !== role) return <Navigate to={`/${user.role}/dashboard`} />


    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.any
}

export default PrivateRoute;