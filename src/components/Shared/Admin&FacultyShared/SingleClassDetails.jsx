import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure"
import LoadingSpinner from "../../Utilities/LoadingSpinner";



const SingleClassDetails = () => {
    const { id } = useParams(); // class id
    const axiosSecure = useAxiosSecure();

    const { data: singleClassDetails = {}, isError, isPending, error } = useQuery({
        queryKey: ["singleClassDetails", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/${id}`);

            return res.data.data;
        },
        enabled: !!id
    })

    console.log(singleClassDetails);

    if (isPending) return <LoadingSpinner />

    return (
        <div className="flex p-3 md:p-8">
            {isError && <p>{error.message}</p>}
        </div>
    );
};

export default SingleClassDetails;