import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import { TbFidgetSpinner, TbLockPassword } from "react-icons/tb";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useTheme from "../../Hooks/useTheme";
import themeStyles from "../../Utilities/themeStyles";
import { MdOutlineEmail } from "react-icons/md";




const SignIn = () => {
    const { theme } = useTheme();
    const { user, login, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const from = location?.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [logInLoading, setLogInLoading] = useState(false);
    const [loginToDefaultAccount, setLoginToDefaultAccount] = useState(false);



    const defaultStudentData = {
        email: "alice.johnson@example.com",
        password: "12345678"
    }

    const defaultFacultyData = {
        email: "james.anderson@example.com",
        password: "12345678"
    }



    // login function
    const handleLogin = async (data) => {
        const email = data.email;
        const password = data.password;

        if (user) {
            toast.error('Already logged in.', {
                duration: 1500,
                position: 'top-center',
            });
            return setTimeout(() => {
                navigate("/", { replace: true })
            }, 1600)
        }

        try {
            setLogInLoading(true);
            const loggedInUser = await login(email, password);

            if (loggedInUser) {
                reset();
                setLogInLoading(false);
                toast.success('Login Successful!', {
                    duration: 1500,
                    position: 'top-center',
                });

                let redirectedPath = from;
                if (loggedInUser.password_update_required) {
                    redirectedPath = `/${loggedInUser.user_role}/profile`
                } else if (!from.includes(loggedInUser.user_role)) {
                    redirectedPath = "/";
                }

                //Redirect after the toast duration
                setTimeout(() => {
                    navigate(redirectedPath, { replace: true });
                }, 1600);
            }
        }
        catch (error) {
            setLogInLoading(false);
            toast.error(`${error}`, {
                duration: 1500,
                position: 'top-center',
            });
            console.error(error);
        }
    };



    // default account login function
    const handleDefaultLogin = async (type) => {

        let email;
        let password;

        if (type === "student") {
            email = defaultStudentData.email;
            password = defaultStudentData.password;
        }


        if (type === "faculty") {
            email = defaultFacultyData.email;
            password = defaultFacultyData.password;
        }



        if (user) {
            toast.error('Already logged in.', {
                duration: 1500,
                position: 'top-center',
            });
            return setTimeout(() => {
                navigate("/", { replace: true })
            }, 1600)
        }

        try {
            setLogInLoading(true);
            const loggedInUser = await login(email, password);

            if (loggedInUser) {
                reset();
                setLogInLoading(false);
                toast.success('Login Successful!', {
                    duration: 1500,
                    position: 'top-center',
                });

                let redirectedPath = from;
                if (loggedInUser.password_update_required) {
                    redirectedPath = `/${loggedInUser.user_role}/profile`
                } else if (!from.includes(loggedInUser.user_role)) {
                    redirectedPath = "/";
                }

                //Redirect after the toast duration
                setTimeout(() => {
                    navigate(redirectedPath, { replace: true });
                }, 1600);
            }
        }
        catch (error) {
            setLogInLoading(false);
            toast.error(`${error}`, {
                duration: 1500,
                position: 'top-center',
            });
            console.error(error);
        }
    };


    return (
        <div className="min-h-screen py-10 px-4 md:px-28 lg:px-44">
            <div className="flex-col">
                <div className="text-center">
                    <Toaster />
                    <h1 className="text-5xl font-bold">Login</h1>
                    <p className="py-6 font-medium">
                        Sign in to your EduVerse account to continue your learning journey.
                    </p>
                </div>


                {/* login form */}
                {
                    !loginToDefaultAccount &&
                    <div className={`${themeStyles?.background[theme]} border-0 rounded-lg w-full md:w-4/5 lg:w-3/5 mx-auto shadow-2xl`}>

                        {/* login form */}
                        <form onSubmit={handleSubmit(handleLogin)} className="px-3 md:px-5 pt-5 mb-3 space-y-4">

                            {/* email */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-bold">Email:</span>
                                </label>

                                <div className="relative">
                                    <MdOutlineEmail className="absolute top-1/2 left-2 -translate-y-1/2 text-lg" />
                                    <input type="email" placeholder="you@example.com" className="input w-full input-bordered pl-7"
                                        {...register("email", { required: "Email Address is required" })} />
                                    {errors.email && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* password */}
                            <div className="relative">
                                <label className="label">
                                    <span className="label-text font-bold">Password:</span>
                                </label>

                                <div className="relative">
                                    {
                                        showPassword ?
                                            <button type="button" onClick={() => setShowPassword(false)} className="btn absolute right-3 btn-xs top-1/2 -translate-y-1/2">
                                                <FaEyeSlash />
                                            </button>
                                            :
                                            <button type="button" onClick={() => setShowPassword(true)} className="btn absolute right-3 btn-xs top-1/2  -translate-y-1/2">
                                                <FaEye />
                                            </button>
                                    }

                                    <TbLockPassword className="text-lg absolute top-1/2 left-2 -translate-y-1/2" />
                                    <input type={
                                        showPassword ? "text" :
                                            "password"} placeholder="********" className="input  input-bordered w-full pl-7"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Password must be at least 6 character" }, maxLength: { value: 32, message: "Password must be within 32 character" },
                                        })}
                                    />
                                    {
                                        errors.password && <p className="text-error text-sm pl-3 pt-1 animate-pulse">{errors.password.message}</p>
                                    }
                                </div>
                            </div>

                            {/* login button */}
                            <div className="form-control">
                                {
                                    loading ?
                                        <button type="submit" className="btn btn-primary btn-disabled" ><TbFidgetSpinner className="animate-spin text-lg" /></button>

                                        :

                                        <button type="submit"
                                            disabled={logInLoading} className="btn btn-success text-white ">Login</button>
                                }
                            </div>
                        </form>

                        <div className="px-7 pb-7 flex justify-between">

                            <Link to="/passwordReset" className="text-error font-medium hover:underline text-sm">Forgot Password?</Link>

                            <p onClick={() => setLoginToDefaultAccount(true)} className="text-sm cursor-pointer hover:text-success">Direct Login</p>
                        </div>
                    </div>
                }


                {
                    loginToDefaultAccount &&
                    <div className={`${themeStyles?.background[theme]} border-0 rounded-lg w-3/5 mx-auto shadow-2xl p-5 text-center`}>


                        <div className="flex justify-center gap-3 flex-col md:flex-row mb-4">
                            <button
                                onClick={() => handleDefaultLogin("student")}
                                className="btn btn-outline"
                                disabled={logInLoading}
                            >
                                Student Account
                            </button>

                            <button
                                onClick={() => handleDefaultLogin("faculty")}
                                className="btn btn-outline"
                                disabled={logInLoading}
                            >
                                Faculty Account
                            </button>
                        </div>

                        <p onClick={() => setLoginToDefaultAccount(false)} className="hover:text-success cursor-pointer inline">Login Form</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default SignIn;