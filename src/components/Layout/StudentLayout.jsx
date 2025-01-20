import { Outlet } from "react-router";
import StudentSidebar from "../Shared/StudentSidebar";


const StudentLayout = () => {
    return (
        <div className="flex">
            <StudentSidebar />
            <Outlet></Outlet>
        </div>
    );
};

export default StudentLayout;