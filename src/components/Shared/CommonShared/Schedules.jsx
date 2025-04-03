import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import ClassScheduleFormAndList from "../Admin&FacultyShared/ClassScheduleFormAndList";

const Schedules = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: allClassList = [] } = useQuery({
        queryKey: ["allClassList"],
        queryFn: async () => {
            const res = await axiosSecure.get("/classes");

            return res.data.data;
        },
        enabled: user.user_role === "admin"
    });

    console.log(allClassList);


    return (
        <div>
            <ClassScheduleFormAndList />
        </div>
    );
};

export default Schedules;