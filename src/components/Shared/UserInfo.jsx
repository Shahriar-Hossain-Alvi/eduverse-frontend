import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../Hooks/useAuth";
import { FiMail, FiUser, FiPhone, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { FaUserCog } from "react-icons/fa";


const UserInfo = () => {
    const { user, setUser, fetchUserInfo } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, handleSubmit: handlePasswordSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure();


    // Handle user info update
    const onUpdateUser = async (data) => {
        const updateInfo = {};
        const first_name = data?.firstName;
        const last_name = data?.lastName;
        const phone = data?.phone;
        const address = data?.address;

        if (first_name) updateInfo.first_name = first_name;
        if (last_name) updateInfo.last_name = last_name;
        if (phone) updateInfo.phone = phone;
        if (address) updateInfo.address = address;


        try {
            if (Object.keys(updateInfo).length === 0) {
                toast.error("No Changes were made!", {
                    duration: 1500,
                    position: "top-center"
                });
                setIsEditing(false);
                return;
            }

            const res = await axiosSecure.patch(`/users/${user?._id}`, updateInfo);

            if (res.data.success === true) {
                // fetch user data after updating info
                const updatedUser = await fetchUserInfo();
                setUser(updatedUser);

                toast.success(`${res?.data?.message}`, {
                    duration: 1500,
                    position: "top-center"
                })
                reset();
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
        setIsEditing(false);
    };


    // Handle password update
    const onUpdatePassword = async (data) => {
        const old_password = data.currentPassword;
        const new_password = data.newPassword;


        if (!old_password || !new_password) {
            toast.error("Fill up both fields to update password", {
                duration: 3500,
                position: "top-center"
            });
            return;
        }

        if (old_password === new_password) {
            toast.error("New password can not be same as the old password", {
                duration: 2500,
                position: "top-center"
            })
            return;
        }

        const updatePasswordInfo = { old_password, new_password }

        try {
            const res = await axiosSecure.patch(`/users/updatePassword/${user?._id}`, updatePasswordInfo);

            if (res.data.success === true) {
                // fetch user data after updating password
                const updatedUser = await fetchUserInfo();
                setUser(updatedUser);

                toast.success(`${res.data.message}`, {
                    duration: 1500,
                    position: "top-center"
                })
                reset();
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

        setIsEditing(false);
    };

    return (
        <div className="p-3 md:p-8">

            {/* Button to enable form editing */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h3 className="text-xl md:text-3xl font-bold indicator">User Profile</h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-primary btn-xs md:btn-md mt-2 md:mt-0 text-white"
                    >
                        <FiEdit2 className="mr-2" /> Edit Profile
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSubmit(onUpdateUser)}
                            className="btn btn-success btn-xs md:btn-md mt-2 md:mt-0 text-white"
                        >
                            <FiSave className="mr-2" /> Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-error btn-xs md:btn-md mt-2 md:mt-0 text-white"
                        >
                            <FiX className="mr-2" /> Cancel
                        </button>
                    </div>
                )}
            </div>


            {/* show error is password needs to be updated */}

            {
                user.password_update_required &&
                <div role="alert" className="alert alert-warning shadow-lg my-5">
                    <IoWarningOutline className="text-xl" />
                    <div>
                        <h3 className="font-bold">Security Alert!</h3>
                        <div className="text-sm">  For your account&apos;s security, please update your password immediately.
                            Using the default password increases the risk of unauthorized access.
                            Set a strong, unique password to protect your account.</div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="btn btn-sm">Update Now</button>
                </div>
            }


            {/* Separate Password Update Form */}
            {isEditing && (
                <form className="divide-y divide-gray-200 mt-6" onSubmit={handlePasswordSubmit(onUpdatePassword)}>
                    <h4 className="text-lg font-semibold mb-6">Change Password</h4>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="text-sm font-medium text-gray-500 flex items-center">
                            <FiLock className="mr-2" /> Current Password
                        </label>

                        <div>
                            <input {...register("currentPassword", {
                                minLength: {
                                    value: 6,
                                    message: "Minimum length is 6 characters"
                                }, maxLength: {
                                    value: 30,
                                    message: "Maximum length is 30 Characters"
                                }
                            })} type="password" className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter current password" />
                            {errors.currentPassword && <span className="text-red-500 text-sm">{errors.currentPassword.message}</span>}
                        </div>
                    </div>


                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <label className="text-sm font-medium text-gray-500 flex items-center">
                            <FiLock className="mr-2" /> New Password
                        </label>
                        <div>
                            <input {...register("newPassword", {
                                minLength: {
                                    value: 6,
                                    message: "Minimum length is 6 characters"
                                }, maxLength: {
                                    value: 30,
                                    message: "Maximum length is 30 Characters"
                                }
                            })} type="password" className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter new password" />
                            {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                        <FiSave className="mr-2" /> Update Password
                    </button>
                </form>
            )}


            {/* show and update user info form */}
            <form className="divide-y divide-gray-200">

                {/* Email */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center"
                    >
                        <FiMail className="mr-2" /> Email
                    </label>
                    <p className="mt-1 text-sm sm:mt-0 sm:col-span-2">{user?.email}</p>
                </div>


                {/* user name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center"
                    >
                        <FaUserCog className="mr-2" /> Username
                    </label>
                    <p className="mt-1 text-sm sm:mt-0 sm:col-span-2">{user?.user_name}</p>
                </div>


                {/* First Name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FiUser className="mr-2" /> First Name
                    </label>

                    {isEditing ? <input type="text" {...register("firstName")} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`${user?.first_name}`} /> : <p>{user?.first_name}</p>}
                </div>


                {/* Last Name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FiUser className="mr-2" /> Last Name
                    </label>
                    {isEditing ? <input type="text" {...register("lastName")} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`${user?.last_name}`} /> : <p>{user?.last_name}</p>}
                </div>


                {/* Phone */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FiPhone className="mr-2" /> Phone
                    </label>
                    {isEditing ? <input type="text" {...register("phone")}
                        defaultValue={null} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={user?.phone !== null ? `${user.phone}` : "Add your number"} /> : <p>{user?.phone || "Add number*"}</p>}
                </div>


                {/* Address */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FiMapPin className="mr-2" /> Address
                    </label>
                    {isEditing ? <textarea {...register("address")} defaultValue={null} className="mt-1 block w-full border-gray-300 rounded-md textarea focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={user?.address !== null ? `${user.address}` : "Add your address"}></textarea> : <p>{user?.address || "Add address*"}</p>}
                </div>
            </form>
        </div>
    );
};

export default UserInfo;