import LoadingSpinner from "../Utilities/LoadingSpinner";
import useAuth from "../Hooks/useAuth"
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

const RoleBasedRedirect = () => {
  const { user, loading, fetchUserInfo } = useAuth();
  const [role, setRole] = useState(null);

  // useEffect(() => {
  //   if (user) {
  //     fetchUserInfo().then((userData) => {
  //       setRole(userData.user_role)
  //     }).catch(() => setRole(null));
  //   }
  // }, [fetchUserInfo, user]);

  useEffect(() => {
    let mounted = true;

    if (user) {
      fetchUserInfo()
        .then((userData) => {
          if (mounted) {
            setRole(userData.user_role);
          }
        })
        .catch(() => {
          if (mounted) {
            setRole(null);
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [fetchUserInfo, user]);

  if (loading || (user && !role)) return <LoadingSpinner />;

  if (!user)  {
    console.log("Go to sign in from role based redirect  line 43");
    return <Navigate to="/signin" />
  };

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
