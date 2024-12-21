import { useContext } from "react";
import { Link } from "react-router";
import { ThemeContext } from "../../Provider/ThemeContext";
import { useForm } from "react-hook-form";


const SignIn = () => {
    const { theme } = useContext(ThemeContext);

    const { register, handleSubmit, formState: { errors } } = useForm();


    // login function
    const handleLogin = (data) => {
        const email = data.email;
        const password = data.password

        console.log({ email, password })
    };


    return (
        <div className="bg-base-200 min-h-screen py-20 px-20 md:px-28 lg:px-44">
            <div className="flex-col">
                <div className="text-center">
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
                                        minLength: { value: 8, message: "Password must be at least 8 character" }, maxLength: { value: 32, message: "Password must be within 32 character" },
                                    })}
                                />
                                {
                                    errors.password && <p className="text-error text-sm pl-3 pt-1 animate-pulse">{errors.password.message}</p>
                                }
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>

                    <div className="px-7 pb-7">
                        <Link to="/passwordReset" className="text-error font-medium hover:underline">Forgot Password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;