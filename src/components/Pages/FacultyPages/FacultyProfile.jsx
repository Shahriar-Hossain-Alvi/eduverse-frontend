import FacultySidebar from "../../Shared/FacultySidebar";
import { Toaster } from "react-hot-toast";
import UserInfo from "../../Utilities/UserInfo";

const FacultyProfile = () => {

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <FacultySidebar />
      <Toaster/>

      {/* User Info */}
      <UserInfo />
    </div>
  );
};

export default FacultyProfile;
