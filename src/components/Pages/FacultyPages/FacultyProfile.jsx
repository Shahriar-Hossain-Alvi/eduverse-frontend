import { Toaster } from "react-hot-toast";
import UserInfo from "../../Utilities/UserInfo";

const FacultyProfile = () => {

  return (
    <div className="min-h-screen flex-1">
      <Toaster/>

      {/* User Info */}
      <UserInfo />
    </div>
  );
};

export default FacultyProfile;
