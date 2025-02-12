import { Toaster } from "react-hot-toast";
import UserInfo from "../../Shared/CommonShared/UserInfo";


const AdminProfile = () => {
    return (
        <div className="flex-1 p-3 md:p-8">
            <Toaster />

            <UserInfo />
        </div>
    );
};

export default AdminProfile;