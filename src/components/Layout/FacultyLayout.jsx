import { Outlet } from "react-router";
import FacultySidebar from "../Shared/FacultyShared/FacultySidebar";


const FacultyLayout = () => {
    return (
        <div className="flex min-h-screen">
            <FacultySidebar />
            <Outlet></Outlet>
        </div>
    );
};

export default FacultyLayout;