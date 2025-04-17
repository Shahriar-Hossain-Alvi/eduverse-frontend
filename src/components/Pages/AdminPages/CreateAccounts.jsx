import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { IoIosPersonAdd } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import SectionHeading from "../../Utilities/SectionHeading";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useState } from "react";
import { handleError } from "../../Utilities/handleError";


const CreateAccounts = () => {
    const axiosSecure = useAxiosSecure();
    const { register, reset, formState: { errors }, handleSubmit } = useForm();
    const [buttonLoading, setButtonLoading] = useState(false);


    const handleCreateAccounts = async (data) => {
        const first_name = data.firstName;
        const last_name = data.lastName;
        const email = data.email;
        const password = data.password;
        const user_role = data.role;

        if (user_role === "select a role") {
            toast.error("Select a role", {
                duration: 2500,
                position: "top-center"
            })
            return;
        }

        const newUserInfo = {
            first_name, last_name, email, password, user_role
        }

        try {
            setButtonLoading(true);
            const res = await axiosSecure.post("/users", newUserInfo);

            if (res.data.success === true) {
                toast.success(res.data.message,{
                    duration: 1500,
                    position: "top-center"
                });
                reset();
                setButtonLoading(false);
            }

        } catch (error) {
            console.log(error);
            setButtonLoading(false);
            handleError(error, "Account creation failed");
        }
    }

    return (
        <div className="flex-1 p-3 md:p-8">
            <SectionHeading title="User Profile" />
            <Toaster />

            {/* Form Starts here */}
            <form onSubmit={handleSubmit(handleCreateAccounts)} className="divide-y divide-gray-200">

                {/* email */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <FiMail className="mr-2" /> Email
                    </label>

                    <div className="col-span-2">
                        <input type="email" {...register("email", { required: "Email is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add email" />
                        {errors.email && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.email.message}</p>}
                    </div>
                </div>


                {/* first name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <IoIosPersonAdd className="mr-2" /> First Name
                    </label>
                    <div className="col-span-2">
                        <input type="text" {...register("firstName", { required: "First name is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add first name" />
                        {errors.firstName && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.firstName.message}</p>}
                    </div>
                </div>


                {/* last name */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-500 flex items-center">
                        <IoIosPersonAdd className="mr-2" /> Last Name
                    </label>
                    <div className="col-span-2">
                        <input type="text" {...register("lastName", { required: "Last name is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add last name" />
                        {errors.lastName && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.lastName.message}</p>}
                    </div>
                </div>


                {/* password  */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <RiLockPasswordFill className="mr-2" /> Password
                    </label>

                    <div className="col-span-2">
                        <input type="text" defaultValue={"123456"} {...register("password", { required: "Password is required" })} className="mt-1 w-full border-gray-300 rounded-md input focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add password" />
                        {errors.password && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.password.message}</p>}
                    </div>
                </div>


                {/* role */}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                        <FaUserCircle className="mr-2" /> Role
                    </label>
                    <select {...register("role", { required: "Role is required" })} defaultValue="select a role" className="select select-bordered mt-1 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500  col-span-2">
                        <option value="select a role" disabled>Select a ROLE</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>
                    {errors.role && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.role.message}</p>}
                </div>


                {/* submit button */}
                <div className="py-4 sm:py-5 sm:gap-4">
                    <button
                    disabled={buttonLoading}
                    className="btn bg-indigo-700 text-white hover:bg-indigo-600 w-full">Create</button>
                </div>
            </form>
        </div>
    );
};

export default CreateAccounts;