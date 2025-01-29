import { Toaster } from "react-hot-toast";
import UserInfo from "../../Utilities/UserInfo";

const StudentProfile = () => {


  return (
    <div className="flex-1">
      <Toaster />

      {/* User Info */}
      <UserInfo />
    </div>
  );
};

export default StudentProfile;
