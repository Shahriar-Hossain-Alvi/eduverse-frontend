import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import PropTypes from 'prop-types';
import LoadingSpinner from "../Utilities/LoadingSpinner";

const PrivateRoute = ({ children }) => {
    const { loading, user } = useAuth();
    const location = useLocation()
    

    if (loading) return <LoadingSpinner />

    if (user) return children;

    return <Navigate to="/signin" state={{ from: location }}></Navigate>
};

PrivateRoute.propTypes = {
    children: PropTypes.any
}

export default PrivateRoute;