import { toast } from "react-hot-toast";

export const handleError = (error, defaultMessage = "Something went wrong.") => {
    console.error(error);
    const errorMessage = error.response?.data?.message || defaultMessage;
    toast.error(errorMessage, { duration: 3000, position: "top-center" });
};