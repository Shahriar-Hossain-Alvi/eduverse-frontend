import { Toaster } from "react-hot-toast";
import UserInfo from "../../Utilities/UserInfo";


const AdminProfile = () => {
    return (
        <div className="min-h-screen flex-1 p-3 md:p-8">
            <Toaster />

            <UserInfo />
        </div>
    );
};

export default AdminProfile;