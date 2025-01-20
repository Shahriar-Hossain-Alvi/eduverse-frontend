import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { IoIosPersonAdd } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";


const CreateAccounts = () => {

    const { register, reset, formState: { errors }, handleSubmit } = useForm();


    const handleCreateAccounts = (data) => {
        console.log(data);
    }

    return (
        <div className="flex-1 p-8">

            {/* Button to enable form editing */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold indicator">User Profile</h3>
            </div>

            {/* show and update user info form */}
            <form className="divide-y divide-gray-200">


                {/* email */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <FiMail className="mr-2" /> Email
                    </label>

                    <input type="email" {...register("email")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 col-span-2" placeholder="Add email" />
                </div>


                {/* first name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <IoIosPersonAdd className="mr-2" /> First Name
                    </label>
                    <input type="text" {...register("firstName")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 col-span-2" placeholder="Add first name" />
                </div>


                {/* last name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <IoIosPersonAdd className="mr-2" /> Last Name
                    </label>
                    <input type="text" {...register("lastName")} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 col-span-2" placeholder="Add last name" />
                </div>


                {/* password  */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <RiLockPasswordFill className="mr-2" /> Password
                    </label>
                    <input type="password" {...register("password", { required: "Password is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm col-span-2" placeholder="Add password" />
                </div>


                {/* role */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FaUserCircle className="mr-2" /> Role
                    </label>
                    <select {...register("role")} defaultValue="select a role" className="select select-bordered mt-1 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500  col-span-2">
                        <option value="select a role" disabled>Select a ROLE</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>
                </div>
            </form>
        </div>
    );
};

export default CreateAccounts;