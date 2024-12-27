import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";


const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { data: AllStudents, isPending, isError } = useQuery({
        queryKey: ["AllStudents"],
        queryFn: async () => {
            const res = await axiosSecure("/users");
            if (res.data.success) return res.data.data
        }
    })

    if (isPending) return <LoadingSpinner />

    return (
        <div>
            admin dashboard
            <h1>Total Users: {AllStudents.length}</h1>
        </div>
    );
};

export default AdminDashboard;