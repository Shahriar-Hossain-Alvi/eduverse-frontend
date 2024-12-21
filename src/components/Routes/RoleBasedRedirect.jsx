import LoadingSpinner from "../Utilities/LoadingSpinner";
import useAuth from "../Hooks/useAuth"
import { Navigate } from "react-router";

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/signin" />;

  // Redirect based on user role
  switch (user.user_role) {
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    case "faculty":
      return <Navigate to="/faculty/dashboard" />;
    case "student":
      return <Navigate to="/student/dashboard" />;
    default:
      return <Navigate to="/signin" />;
  }
};

export default RoleBasedRedirect;
