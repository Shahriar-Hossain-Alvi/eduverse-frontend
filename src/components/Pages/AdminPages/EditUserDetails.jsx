import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { FiEdit, FiLock, FiSave, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import SectionHeading from "../../Utilities/SectionHeading";
import { useState } from "react";


const EditUserDetails = () => {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    // react hook form
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // tanstack query
    const axiosSecure = useAxiosSecure();
    const { data: userDetails, isError, error, isPending, refetch } = useQuery({
        queryKey: ["userDetails"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${id}`);
            return res.data.data;
        }
    });

    if (isPending) return <LoadingSpinner />


    // enable/disable form edit
    const toggleEdit = () => {
        if (isEditing) {
            reset(); // reset form value if cancel button is pressed
        }
        setIsEditing(!isEditing)
    }


    // user update function
    const handleUserDetailsUpdate = async (data) => {
        console.log(data);
    }

    console.log(userDetails);

    return (
        <div className="min-h-screen flex-1 p-3 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <SectionHeading title="User Details" />

                <button onClick={toggleEdit} className={`btn ${isEditing ? "btn-error text-white" : "btn-primary"}`}>
                    {isEditing ? <FiX /> : <FiEdit />}
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>


            {/* user update form */}
            <form onSubmit={handleSubmit(handleUserDetailsUpdate)}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">

                    {/* first name */}
                    <div>
                        <label className="block text-sm font-medium ">
                            First Name
                        </label>
                        <input
                            type="text"
                            {...register("firstName")}
                            readOnly={!isEditing}
                            className="mt-1 input input-sm block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={userDetails.first_name}
                        />
                    </div>


                    {/* last name */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Last Name
                        </label>
                        <input
                            type="text"
                            {...register("lastName")}
                            readOnly={!isEditing}
                            className="mt-1 block w-full input input-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={userDetails.last_name}
                        />
                    </div>


                    {/* email */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Email
                        </label>
                        <input
                            type="email"
                            readOnly
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm sm:text-sm"
                            placeholder={userDetails.email}
                        />
                    </div>


                    {/* user name */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Username
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm sm:text-sm"
                            placeholder={userDetails.user_name}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium ">
                            Phone
                        </label>
                        <input
                            type="text"
                            {...register("phone")}
                            readOnly={!isEditing}
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={userDetails.phone || "Phone number not added"}
                        />
                    </div>


                    {/* address */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Address
                        </label>
                        <textarea
                            type="text"
                            id="address"
                            {...register("address")}
                            readOnly={!isEditing}
                            className="mt-1 block w-full textarea textarea-sm  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={userDetails.address || "Address not added"}
                        />
                    </div>


                    {/* user role */}
                    <div>
                        <label className="block text-sm font-medium ">
                            User Role
                        </label>
                        <input
                            type="text"
                            id="user_role"
                            readOnly
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm sm:text-sm"
                            placeholder={userDetails.user_role}
                        />
                    </div>


                    {/* user id */}
                    <div>
                        <label className="block text-sm font-medium ">
                            User ID
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm sm:text-sm"
                            placeholder={userDetails._id}
                        />
                    </div>
                </div>



                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">

                    {/* creation time */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Created At
                        </label>
                        <input
                            type="text"
                            placeholder={new Date(userDetails.createdAt).toLocaleString()}
                            readOnly
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm sm:text-sm"
                        />
                    </div>


                    {/* update time */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Updated At
                        </label>
                        <input
                            type="text"
                            placeholder={new Date(userDetails.updatedAt).toLocaleString()}
                            readOnly
                            className="mt-1 block w-full input input-sm  border-gray-300 rounded-md shadow-sm sm:text-sm"
                        />
                    </div>



                    {/* password update status */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Default Password update status
                        </label>
                        <input
                            type="text"
                            placeholder={userDetails.password_update_required ? "Not Updated" : "Updated"}
                            readOnly
                            className={`mt-1 block w-full input input-sm border-2 ${userDetails.password_update_required ? "border-warning" : "border-success"} rounded-md shadow-sm sm:text-sm"`}
                        />
                    </div>



                    {/* account status */}
                    <div>
                        <label className="block text-sm font-medium ">
                            Default Password update status
                        </label>
                        <input
                            type="text"
                            placeholder={userDetails.password_update_required ? "Not Updated" : "Updated"}
                            readOnly
                            className={`mt-1 block w-full input input-sm border-2 ${userDetails.password_update_required ? "border-warning" : "border-success"} rounded-md shadow-sm sm:text-sm"`}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={toggleEdit} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <FiSave className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditUserDetails;