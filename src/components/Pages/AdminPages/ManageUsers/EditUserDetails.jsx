import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import SectionHeading from "../../../Utilities/SectionHeading";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import Swal from "sweetalert2";
import { handleError } from "../../../Utilities/handleError";


const EditUserDetails = () => {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

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
        const updatedInfo = {};
        const first_name = data.firstName;
        const last_name = data.lastName;
        const phone = data.phone;
        const address = data.address;

        if (data.isActive === "active") {
            const is_active = true;
            if (is_active !== userDetails.is_active) updatedInfo.is_active = is_active;
        }
        if (data.isActive === "disable") {
            const is_active = false;
            if (is_active !== userDetails.is_active) updatedInfo.is_active = is_active;
        }


        if (first_name) updatedInfo.first_name = first_name;
        if (last_name) updatedInfo.last_name = last_name;
        if (phone) updatedInfo.phone = phone;
        if (address) updatedInfo.address = address;

        try {
            if (Object.keys(updatedInfo).length === 0) {
                toast.error("No Changes were made!", {
                    duration: 1500,
                    position: "top-center"
                });
                setIsEditing(false);
                return;
            }

            const res = await axiosSecure.patch(`/users/${id}`, updatedInfo);

            if (res?.data?.success == true) {
                toast.success(`${res.data.message}`, {
                    duration: 1500,
                    position: "top-center"
                })
                refetch();
                setIsEditing(false);
            }
        } catch (error) {
            console.log(error);
            const errorMessage =
                error.response?.data?.message || "Something went wrong! Please try again.";

            toast.error(errorMessage, {
                duration: 3000,
                position: "top-center"
            });
        }
    }


    // delete user function
    const handleDeleteUser = async () => {

        const swalResponse = await Swal.fire({
            title: "Are you sure?",
            text: "It can't be undone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#16A34A",
            confirmButtonText: "Yes, delete it!"
        });

        if (swalResponse.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/users/${id}`);

                if (res.data.success === true) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "This class schedule has been deleted.",
                        icon: "success",
                        confirmButtonColor: "#16A34A",
                    });
                    refetch();
                    navigate("/admin/users", { replace: true })
                }
            } catch (error) {
                handleError(error, "Something went wrong! Please try again.")
            }
        }
    }

    return (
        <div className="flex-1 p-3 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <SectionHeading title="User Details" />
                <Toaster />


                <button onClick={toggleEdit} className={`btn ${isEditing ? "btn-error text-white" : "btn-primary"}`}>
                    {isEditing ? <FiX /> : <FiEdit />}
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            {
                isError && <TanstackQueryErrorMessage errorMessage={error.message} />
            }

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
                        {errors.firstName && <p className="text-sm text-error">{errors.firstName.message}</p>}
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
                        {errors.lastName && <p className="text-sm text-error">{errors.lastName.message}</p>}
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


                    {/* phone */}
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
                        {errors.phone && <p className="text-sm text-error">{errors.phone.message}</p>}
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
                        {errors.address && <p className="text-sm text-error">{errors.address.message}</p>}
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


                    {/* is active */}
                    <div>
                        <label className="block text-sm font-medium">
                            Account Status
                            <span className={`indicator-item badge ${userDetails.is_active ? "badge-success" : "badge-error"} badge-xs ml-2`}></span>
                        </label>
                        <select
                            {...register("isActive")}
                            disabled={!isEditing}
                            className="select select-sm w-full"
                        >
                            <option value="active">Active</option>
                            <option value="disable">Disabled</option>
                        </select>

                        {errors.isActive && <p className="text-sm text-error">{errors.isActive.message}</p>}
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={toggleEdit} className="btn btn-error text-white">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success text-white">
                            <FiSave className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                )}
            </form>


            <div className="divider divider-error mt-10"></div>
            <div className="divider divider-error">Danger Zone</div>
            <div className="divider divider-error mb-10"></div>

            {/* Delete user button */}
            <div className="mb-10">
                <div className="flex gap-3">
                    <h1 className="text-lg font-medium">Do you want to Delete This User?</h1>
                    <button onClick={() => handleDeleteUser()} className="btn btn-sm text-white btn-error">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserDetails;