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
    const [otpSent, setOtpSent] = useState(false);


    const handleGetOTP = async (data) => {
        const email = data.email
        console.log(email);

        try {
            setButtonLoading(true);
            const res = await axiosPublic.post("/sendOTP", { email });

            console.log(res);

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

    return (
        <div className="min-h-screen p-3 md:p-8">
            <Toaster />
            <div className="max-w-lg mx-auto mt-20">
                <SectionHeading title="Reset Your Password" />


                {/* get email and send to server for otp */}
                <form onSubmit={handleSubmit(handleGetOTP)} className="space-y-2">

                    <div className="form-control gap-2">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>

                        <input type="email" placeholder="Enter your email" className="input input-bordered"
                            {...register("email", {
                                required: "Email is required for password reset."
                            })} />

                        {errors.email && <p className="text-error text-sm  pl-3 pt-1">{errors.email.message}</p>}
                    </div>

                    <button disabled={buttonLoading} type="submit" className="btn btn-success btn-block text-white">Get OTP</button>
                </form>



                {/* if otp sent, get the new password */}
                {
                    otpSent &&
                    <form onSubmit={handleSubmit(handleGetOTP)} className="space-y-2">

                        <div className="form-control gap-2">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>

                            <input type="email" placeholder="Enter your email" className="input input-bordered"
                                {...register("email", {
                                    required: "Email is required for password reset."
                                })} />

                            {errors.email && <p className="text-error text-sm  pl-3 pt-1">{errors.email.message}</p>}
                        </div>

                        <button disabled={buttonLoading} type="submit" className="btn btn-success btn-block text-white">Get OTP</button>
                    </form>
                }
            </div>

        </div>
    );
};

export default PasswordReset;