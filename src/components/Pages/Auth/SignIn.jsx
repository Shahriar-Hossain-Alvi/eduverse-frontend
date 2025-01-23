import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useTheme from "../../Hooks/useTheme"
import { TbFidgetSpinner } from "react-icons/tb";
import toast, { Toaster } from 'react-hot-toast';

const SignIn = () => {
    const { theme } = useTheme();
    const { user, login, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location?.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors }, reset } = useForm();



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
            const loggedInUser = await login(email, password);

            if (loggedInUser) {
                reset();
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
            toast.error(`${error}`, {
                duration: 1500,
                position: 'top-center',
            });
            console.error(error);
        }
    };


    return (
        <div className="bg-base-200 min-h-screen py-20 px-20 md:px-28 lg:px-44">
            <div className="flex-col">
                <div className="text-center">
                    <Toaster />
                    <h1 className="text-5xl font-bold">Login</h1>
                    <p className={`py-6 font-medium ${theme === "dark" ? "text-secondary" : "text-light_secondary"}`}>
                        Use you email and password to login.
                    </p>
                </div>

                <div className="bg-base-100 rounded-lg w-full shadow-2xl">
                    <form onSubmit={handleSubmit(handleLogin)} className="px-7 pt-7 mb-3 space-y-4">
                        <div className="grid grid-cols-12">
                            <label className="label col-span-2">
                                <span className="label-text">Email:</span>
                            </label>

                            <div className="col-span-10">
                                <input type="email" placeholder="Enter your email" className="input w-full input-bordered"
                                    {...register("email", { required: "Email Address is required" })} />
                                {errors.email && <p className="text-error text-sm  pl-3 pt-1 animate-pulse">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-12">
                            <label className="label col-span-2">
                                <span className="label-text">Password:</span>
                            </label>

                            <div className="col-span-10">
                                <input type="password" placeholder="Enter your password" className="input  input-bordered w-full"
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
                        <div className="form-control mt-6">
                            {
                                loading ?
                                    <button type="submit" className="btn btn-primary btn-disabled" ><TbFidgetSpinner className="animate-spin text-lg" /></button> :
                                    <button type="submit" className="btn btn-primary">Login</button>
                            }
                        </div>
                    </form>

                    <div className="px-7 pb-7 justify-between flex">
                        <Link to="/passwordReset" className="text-error font-medium hover:underline">Forgot Password?</Link>

                        <Link to="/signup" className="text-error font-medium hover:underline">Signup</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;