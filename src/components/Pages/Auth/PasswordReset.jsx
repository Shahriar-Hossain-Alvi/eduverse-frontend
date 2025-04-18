import { useForm } from "react-hook-form";
import SectionHeading from "../../Utilities/SectionHeading";
import { handleError } from "../../Utilities/handleError";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";


const PasswordReset = () => {
    const axiosPublic = useAxiosPublic();
    const { register, reset, formState: { errors }, handleSubmit } = useForm();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [emailForReset, setEmailForReset] = useState("");
    const [otpSent, setOtpSent] = useState(false);


    const handleGetOTP = async (data) => {
        const email = data.email
        setEmailForReset(email);

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
        }
    }




    const verifyOtp = async (data) => {
        const otp = data.otp;



        try {
            setButtonLoading(true);
            const res = await axiosPublic.post("/otp/verify", { email: emailForReset, otp });

            if (res.data.success) {
                setButtonLoading(false);
                toast.success(res.data.message, {
                    duration: 1500,
                    position: "top-center"
                })
            }

        } catch (error) {
            handleError(error, "Failed to verify otp");
            setButtonLoading(false);
        }
    }


    console.log(emailForReset);

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
                        <button disabled={buttonLoading} type="submit" className="btn btn-success text-white">Get OTP</button>
                    </div>
                    {errors.email && <p className="text-error text-sm  pl-3 pt-1">{errors.email.message}</p>}


                </form>}



                {/* verify otp */}
                {
                    otpSent &&
                    <div>
                        <h2 className="text-xl font-medium mt-4 text-center">Verify your OTP</h2>




                        {/* verify the otp */}
                        <form onSubmit={handleSubmit(verifyOtp)} className="space-y-2">


                            {/* email */}
                            <div className="flex gap-2 my-4">
                                <label className="label">
                                    <span className="label-text">Email:</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Email not available!!!" className="input input-bordered w-full read-only:input-disabled"
                                    defaultValue={emailForReset}
                                    readOnly
                                />
                            </div>


                            {/* otp */}
                            <div className="flex gap-2 my-4">
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
                                    disabled={buttonLoading} onClick={() => verifyOtp} className="btn btn-success text-white">Verify</button>
                            </div>
                            {errors.otp && <p className="text-error text-sm  pl-3 pt-1">{errors.otp.message}</p>}
                        </form>
                    </div>
                }
            </div>

        </div>
    );
};

export default PasswordReset;