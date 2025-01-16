import { useState } from "react";
import { FiMail, FiUser, FiPhone, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from "react-icons/fi";
import FacultySidebar from "../../Shared/FacultySidebar";
import useAuth from "../../Hooks/useAuth";
import { useForm } from "react-hook-form";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Updated user data:", data);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <FacultySidebar />


      {/* User Info */}
      <div className="w-full overflow-hidden px-2 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">User Profile</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <FiEdit2 className="mr-2" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-success"
              >
                <FiSave className="mr-2" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-error"
              >
                <FiX className="mr-2" /> Cancel
              </button>
            </div>
          )}
        </div>


        {/* FORM starts here */}
        <form className="divide-y divide-gray-200">


          {/* Email */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <label className="text-sm font-medium text-gray-500 flex items-center"
            >
              <FiMail className="mr-2" /> Email
            </label>
            <p className="mt-1 text-sm sm:mt-0 sm:col-span-2">{user?.email}</p>
          </div>


          {/* First Name */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <FiUser className="mr-2" /> First Name
            </label>

            {isEditing ? <input {...register("firstName")} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`${user?.first_name}`} /> : <p>{user?.first_name}</p>}
          </div>


          {/* Last Name */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <FiUser className="mr-2" /> Last Name
            </label>
            {isEditing ? <input {...register("lastName")} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`${user?.last_name}`} /> : <p>{user?.last_name}</p>}
          </div>


          {/* Phone */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <FiPhone className="mr-2" /> Phone
            </label>
            {isEditing ? <input {...register("phone")} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={user?.phone !== null ? `${user.phone}` : "Add your number"} /> : <p>{user?.phone || "Add number*"}</p>}
          </div>


          {/* Address */}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <label className="text-sm font-medium text-gray-500 flex items-center">
              <FiMapPin className="mr-2" /> Address
            </label>
            {isEditing ? <input {...register("address")} className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={user?.address !== null ? `${user.address}` : "Add your address"} /> : <p>{user?.address || "Add address*"}</p>}
          </div>



          {/* Password Fields */}
          {isEditing && (
            <>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <FiLock className="mr-2" /> Current Password
                </label>
                <input {...register("currentPassword")} type="password" className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter current password" />
              </div>


              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <FiLock className="mr-2" /> New Password
                </label>
                <input {...register("newPassword")} type="password" className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter new password" />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
