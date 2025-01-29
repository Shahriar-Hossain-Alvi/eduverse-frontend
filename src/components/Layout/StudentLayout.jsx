import { Outlet } from "react-router";
import StudentSidebar from "../Shared/StudentShared/StudentSidebar";


const StudentLayout = () => {
    return (
        <div className="flex min-h-screen">
            <StudentSidebar />
            <Outlet></Outlet>
        </div>
    );
};

export default StudentLayout;