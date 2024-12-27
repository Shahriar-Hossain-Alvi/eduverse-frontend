import LoadingSpinner from "../Utilities/LoadingSpinner";
import useAuth from "../Hooks/useAuth"
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

const RoleBasedRedirect = () => {
  const { user, loading, fetchUserInfo } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserInfo().then((userData) => {
        setRole(userData.user_role)
      }).catch(() => setRole(null));
    }
  }, [fetchUserInfo, user]);

  if (loading || (user && !role)) return <LoadingSpinner />;

  if (!user) return <Navigate to="/signin" />;

  // Redirect based on user role
  switch (role) {
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
