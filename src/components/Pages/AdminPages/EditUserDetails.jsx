import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";


const EditUserDetails = () => {
    const { id } = useParams();

    const axiosSecure = useAxiosSecure();
    const { data: userDetails, isError, error, isPending } = useQuery({
        queryKey: ["userDetails"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${id}`);
            return res;
        }
    });

    if (isPending) return <LoadingSpinner />


    console.log(userDetails);

    return (
        <div className="flex-1 p-3 md:p-6">
            <h2>User: {id}</h2>
        </div>
    );
};

export default EditUserDetails;