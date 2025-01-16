import { useState } from "react";
import { FiMail, FiUser, FiPhone, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from "react-icons/fi";
import FacultySidebar from "../../Shared/FacultySidebar";
import useAuth from "../../Hooks/useAuth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, handleSubmit: handlePasswordSubmit, formState: { errors }, reset } = useForm();


  const onUpdateUser = (data) => {
    const updateInfo = {};
    const first_name = data?.firstName;
    const last_name = data?.lastName;
    const phone = data?.phone;
    const address = data?.address;

    if (first_name) updateInfo.first_name = first_name;
    if (last_name) updateInfo.last_name = last_name;
    if (phone) updateInfo.phone = phone;
    if (address) updateInfo.address = address;

    console.log("Updated user data:", updateInfo);
    reset();
    setIsEditing(false);
  };


  // Handle password update
  const onUpdatePassword = (data) => {
    const old_password = data.currentPassword;
    const new_password = data.newPassword;


    if(!old_password || !new_password){
      toast.error("Fill up both fields to update password", {
        duration: 3500,
        position: "top-center"
      });
      return;
    }

    const updatePasswordInfo = {old_password, new_password}

    console.log("Updating password:", updatePasswordInfo);

  };

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <FacultySidebar />
      <Toaster/>

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
                onClick={handleSubmit(onUpdateUser)}
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
            {isEditing ? <input {...register("phone")}
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
      </div>
    </div>
  );
};

export default UserProfile;
