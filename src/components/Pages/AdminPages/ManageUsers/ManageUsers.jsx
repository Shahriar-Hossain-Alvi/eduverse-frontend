import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import SectionHeading from "../../../Utilities/SectionHeading";
import UserTableRow from "../../../Utilities/UserTableRow";
import { useState } from "react";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchedQuery, setSearchedQuery] = useState(() => {
        return localStorage.getItem("searchedQuery") || "all";
    });

    const { data: getAllUsers = [], isPending, isError, error } = useQuery({
        queryKey: ["getAllUsers", searchedQuery],
        queryFn: async () => {
            const res = await axiosSecure(`/users?role=${searchedQuery}`);
            if (res.data.success) return res.data.data
        },
        enabled: !!searchedQuery,
    });

    if (isPending) return <LoadingSpinner />

    const onSelectChange = (e) => {
        const selectedRole = e.target.value;
        setSearchedQuery(selectedRole);
        localStorage.setItem("searchedQuery", selectedRole);
    }


    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">

            <div className="flex justify-between">
                <SectionHeading title="Manage Users" />

                <select value={searchedQuery} onChange={onSelectChange} className="select select-bordered select-primary">
                    <option value="all">All</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                </select>
            </div>


            {isError && <p className="text-2xl text-error text-center">{error.message}</p>}


            {getAllUsers.length === 0 && <p className="text-2xl text-error text-center my-5">User List is empty</p>}

            {/* Table */}
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