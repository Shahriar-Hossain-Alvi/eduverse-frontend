import { useState } from 'react';
import { FiMail, FiUser, FiPhone, FiMapPin, FiLock, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import FacultySidebar from '../../Shared/FacultySidebar';
import useAuth from '../../Hooks/useAuth';


const UserProfile = () => {

  const { user } = useAuth();
  console.log(user);
  const [userData, setUserData] = useState({
    email: 'johndoe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    userName: 'johndoe123',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA 12345',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const handiveInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };


  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log('Updated user data:', userData);
    console.log('Current password:', currentPassword);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <FacultySidebar />


      {/* profile details */}
      <div className="w-full overflow-hih4en">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">User Profile</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiEdit2 className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateProfile}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FiSave className="mr-2" /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            )}
          </div>


          <div className="border-t border-gray-200 pt-5">
            <div className="divide-y divide-gray-200">

              {/* email */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMail className="mr-2" /> Email
                </div>
                <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {user?.email}
                </h4>
              </div>


              {/* first name */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <FiUser className="mr-2" /> First Name
                </div>
                <h4 className="mt-1 text-sm  sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={user?.first_name}
                      onChange={handiveInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    user?.first_name
                  )}
                </h4>
              </div>


              {/* last name */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <FiUser className="mr-2" /> Last Name
                </div>
                <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={user?.last_name}
                      onChange={handiveInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    user?.last_name
                  )}
                </h4>
              </div>


              {/* user name */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <FiUser className="mr-2" /> Username
                </div>
                <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {user.user_name}
                </h4>
              </div>



              {/* phone */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <FiPhone className="mr-2" /> Phone
                </div>
                <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={user?.phone || "add number*"}
                      onChange={handiveInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    user?.phone || "add number*"
                  )}
                </h4>
              </div>



              {/* address */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMapPin className="mr-2" /> Address
                </div>
                <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={user?.address || "add address*"}
                      onChange={handiveInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    user?.address || "add address*"
                  )}
                </h4>
              </div>



              {/* update password */}
              {isEditing &&
                (
                  <div>

                    {/* current password */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <FiLock className="mr-2" /> Current Password
                      </div>
                      <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                        <input
                          type="password"
                          name="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter current password"
                        />
                      </h4>
                    </div>


                    {/* new password */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <FiLock className="mr-2" /> New Password
                      </div>
                      <h4 className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                        <input
                          type="password"
                          name="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md input input-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter new password to set"
                        />
                      </h4>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

