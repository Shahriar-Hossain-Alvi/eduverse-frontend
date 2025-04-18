import { useForm } from "react-hook-form";
import SectionHeading from "../../Utilities/SectionHeading";
import { handleError } from "../../Utilities/handleError";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";


const PasswordReset = () => {
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [buttonLoading, setButtonLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);

    const [enablePasswordField, setEnablePasswordField] = useState(false);


    // send otp to user
    const handleGetOTP = async (data) => {
        const email = data.email;
        localStorage.setItem("emailForReset", email);


        try {
            setButtonLoading(true);
            const res = await axiosPublic.post("/otp/send", { email });


            if (res.data.success) {
                setButtonLoading(false);
                setOtpSent(true);
                toast.success(res.data.message, {
                    duration: 1500,
                    position: "top-center"
                })
            }
        } catch (error) {
            handleError(error, "Failed to send otp");
            setButtonLoading(false);
            setOtpSent(false);
            localStorage.removeItem("emailForReset");
        }
    }



    // verify the otp
    const verifyOtp = async (data) => {
        const otp = data.otp;
        const email = localStorage.getItem("emailForReset");



        if (email === "" || otp === "") return toast.error("email or otp is missing.", {
            duration: 1500,
            position: "top-center"
        });

        try {
            setButtonLoading(true);
            const res = await axiosPublic.post("/otp/verify", { email, otp });

            if (res.data.success) {
                setButtonLoading(false);
                setEnablePasswordField(true);
                toast.success(res.data.message, {
                    duration: 1500,
                    position: "top-center"
                })
            }

        } catch (error) {
            handleError(error, "Failed to verify otp");
            setButtonLoading(false);
            setOtpSent(false);
            setEnablePasswordField(false);
        }
    }


    // update password
    const handlePasswordUpdate = async (data) => {
        const email = localStorage.getItem("emailForReset")
        const newPassword = data.newPassword;

        if (!email || email === "" || newPassword === "") {
            return toast.error("Email or password is missing. Refresh the page and try again!", {
                duration: 3000,
                position: "top-center"
            })
        }

        try {
            setButtonLoading(true);
            const res = await axiosPublic.post("/otp/updatePassword", { email, newPassword });

            console.log(res);

            if (res.data.success) {
                toast.success(res.data.message, {
                    duration: 1500,
                    position: "top-center"
                });
                localStorage.removeItem("emailForReset");
                setOtpSent(false);
                setEnablePasswordField(false);
                setButtonLoading(false);
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1600)
            }

        } catch (error) {
            handleError(error, "Failed to update password");
            localStorage.removeItem("emailForReset");
            setOtpSent(false);
            setEnablePasswordField(false);
            setButtonLoading(false);
        }
    }


    return (
        <div className="min-h-screen p-3 md:p-8">
            <Toaster />
            <div className="max-w-lg mx-auto mt-20">
                <SectionHeading title="Reset Your Password" />


                {/* get email and send to server for otp */}
                {!otpSent && <form onSubmit={handleSubmit(handleGetOTP)} className="space-y-2">

                    <div className="flex gap-2">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>

                        <input type="email" placeholder="Enter your email" className="input input-bordered w-full"
                            {...register("email", {
                                required: "Email is required for password reset."
                            })} />
                        <button disabled={buttonLoading} className="btn btn-success text-white">Get OTP</button>
                    </div>

                    {errors.email && <p className="text-error text-sm  pl-3 pt-1">{errors.email.message}</p>}
                </form>}



                {/* verify otp */}
                {
                    otpSent && !enablePasswordField &&
                    <div>
                        <h2 className="text-xl font-medium mt-4 text-center mb-4">Verify your OTP</h2>




                        {/* verify the otp */}
                        <form onSubmit={handleSubmit(verifyOtp)} className="space-y-2">


                            {/* email */}
                            <div className="flex gap-2">
                                <label className="label">
                                    <span className="label-text">Email: </span>
                                </label>

                                <input type="email" placeholder="Enter your email" className="input input-bordered w-full"
                                    defaultValue={localStorage.getItem("emailForReset") || ""}
                                />
                            </div>



                            {/* otp */}
                            <div className=" my-4">
                                <div className="flex gap-2">
                                    <label className="label">
                                        <span className="label-text">OTP:</span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter the otp" className="input input-bordered w-full"

                                        {...register("otp", {
                                            required: "OTP is required for password reset."
                                        })} />

                                    <button
                                        disabled={buttonLoading} className="btn btn-success text-white">Verify</button>
                                </div>

                                {errors.otp && <p className="text-error text-sm  pl-3 pt-1">{errors.otp.message}</p>}
                            </div>

                        </form>
                    </div>
                }




                {/* enable update password field */}
                {
                    otpSent && enablePasswordField &&
                    <div>
                        <h2 className="text-xl font-medium mt-4 text-center mb-4">Create new password</h2>




                        {/* verify the otp */}
                        <form onSubmit={handleSubmit(handlePasswordUpdate)} className="space-y-2">


                            {/* email */}
                            <div className="flex gap-2">
                                <label className="label">
                                    <span className="label-text">Email: </span>
                                </label>

                                <div className="w-full">
                                    <input type="email" placeholder="Enter your email" className="input  read-only:input-disabled w-full"
                                        readOnly
                                        defaultValue={localStorage.getItem("emailForReset") || ""}
                                    />
                                </div>
                            </div>



                            {/* new password */}
                            <div className="flex my-4">
                                <label className="label">
                                    <span className="label-text">Password:</span>
                                </label>

                                <div className="w-full">
                                    <input
                                        type="password"
                                        placeholder="Enter new password" className="input input-bordered w-full"

                                        {...register("newPassword", {
                                            required: "Password is required."
                                        })} />

                                    {errors.newPassword && <p className="text-error text-sm  pl-3 pt-1">{errors.newPassword.message}</p>}
                                </div>
                            </div>

                            <button
                                disabled={buttonLoading} className="btn btn-success text-white btn-block">
                                Update Password
                            </button>
                        </form>
                    </div>
                }
            </div>

        </div>
    );
};

export default PasswordReset;