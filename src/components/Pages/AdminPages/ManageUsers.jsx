import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import UserTableRow from "../../Utilities/UserTableRow";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: getAllUsers, isPending, isError, error } = useQuery({
        queryKey: ["getAllUsers"],
        queryFn: async () => {
            const res = await axiosSecure("/users");
            if (res.data.success) return res.data.data
        }
    });

    if (isPending) return <LoadingSpinner />

    console.log(getAllUsers);

    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">
            <SectionHeading title="Manage Users" />

            {/* Table */}

            {isError && <p className="text-2xl text-error text-center">{error.message}</p>}

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row */}
                        {
                            getAllUsers.map((singleUser, index) => <UserTableRow singleUser={singleUser} serialNo={index} key={singleUser?._id} />)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;