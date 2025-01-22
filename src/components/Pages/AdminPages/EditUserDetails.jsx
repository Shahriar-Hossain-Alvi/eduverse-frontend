import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const EditUserDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { data: userDetails, isError, error, isPending } = useQuery({
        queryKey: ["userDetails"],
        queryFn: async() => {
            const res= await axiosSecure.get(`/users/:id`)
        }
    })

    return (
        <div>
            <h2>User: {id}</h2>
        </div>
    );
};

export default EditUserDetails;