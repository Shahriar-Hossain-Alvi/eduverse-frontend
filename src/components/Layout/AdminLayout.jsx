import { Outlet } from "react-router";
import AdminSidebar from "../Shared/AdminShared/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <Outlet></Outlet>
        </div>
    );
};

export default AdminLayout;