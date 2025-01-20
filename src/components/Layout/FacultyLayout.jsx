import { Outlet } from "react-router";
import FacultySidebar from "../Shared/FacultySidebar";


const FacultyLayout = () => {
    return (
        <div className="flex">
            <FacultySidebar />
            <Outlet></Outlet>
        </div>
    );
};

export default FacultyLayout;