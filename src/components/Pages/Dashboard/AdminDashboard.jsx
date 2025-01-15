import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import AdminSidebar from "../../Shared/AdminSidebar";
import { formatDistance, formatDistanceToNow } from "date-fns";


const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { data: quickOverview, isPending, isError, error } = useQuery({
        queryKey: ["quickOverview"],
        queryFn: async () => {
            const res = await axiosSecure("/adminQuickOverview");
            if (res.data.success) return res.data.data
        }
    })

    const logTimeInWords = (timestamp) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    }


    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h2 className="text-3xl font-semibold mb-6">Dashboard Overview</h2>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-base-300 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Total Students</h3>
                        <p className="text-3xl font-bold text-indigo-600">{quickOverview.totalStudents}</p>
                    </div>
                    <div className="bg-base-300 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Total Courses</h3>
                        <p className="text-3xl font-bold text-indigo-600">{quickOverview.totalCourses}</p>
                    </div>
                    <div className="bg-base-300 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Total Faculty</h3>
                        <p className="text-3xl font-bold text-indigo-600">{quickOverview.totalFaculty}</p>
                    </div>
                    <div className="bg-base-300 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Active Courses</h3>
                        <p className="text-3xl font-bold text-indigo-600">{quickOverview.activeCourses}</p>
                    </div>
                    {
                        isError && <div className="bg-base-300 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Error Happened</h3>
                            <p className="text-3xl font-bold text-indigo-600">{error.message}</p>
                        </div>
                    }

                </div>

                {/* Recent Activities */}
                <div className="bg-base-300 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                    <ul className="space-y-4">
                        {
                            quickOverview?.activities.map(singleActivity => <li key={singleActivity._id} className="flex items-center justify-between">
                                <span>{singleActivity?.action}</span>
                                <span className="text-sm text-gray-500">{logTimeInWords(singleActivity.timestamp)}</span>
                            </li>)
                        }
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;