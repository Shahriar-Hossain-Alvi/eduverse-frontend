import { useContext} from "react";
import { Link } from "react-router";
import { ThemeContext } from "../../Provider/ThemeContext";


const SignIn = () => {

    const { theme } = useContext(ThemeContext);

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
                    <form className="px-7 pt-7 mb-3 space-y-4">
                        <div className="grid grid-cols-12">
                            <label className="label col-span-2">
                                <span className="label-text">Email:</span>
                            </label>
                            <input type="email" placeholder="email" className="col-span-10 input w-full input-bordered" required />
                        </div>

                        <div className="grid grid-cols-12">
                            <label className="label col-span-2">
                                <span className="label-text">Password:</span>
                            </label>

                            <input type="password" placeholder="password" className="col-span-10 input  input-bordered" required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
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