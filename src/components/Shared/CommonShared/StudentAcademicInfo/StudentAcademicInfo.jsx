import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query"
import SectionHeading from "../../../Utilities/SectionHeading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import StudentGradesTab from "./StudentGradesTab";
import StudentAttendanceTab from "./StudentAttendanceTab";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";



const StudentAcademicInfo = () => {
    const { id } = useParams(); //student id
    const axiosSecure = useAxiosSecure();


    //get public info of a user
    const { data: studentInfo = {}, isPending, isError, error } = useQuery({
        queryKey: ["studentInfo", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/publicInfo/${id}`);

            return res.data.data;
        },
        enabled: !!id
    });


    if (isPending) return <LoadingSpinner />



    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">
            <SectionHeading title="Academic Details" />


            {/* student details */}
            <div className="flex border space-x-1 items-center p-3 rounded-lg mx-auto justify-center mb-10">
                {
                    isError && <TanstackQueryErrorMessage errorMessage={error?.message} />
                }

                <div className="text-sm md:text-xl font-medium">
                    <h1>Overview of</h1>
                    <h2>Email Address</h2>
                    <h2>Phone Number</h2>
                </div>

                <div className="text-sm md:text-xl font-medium px-2">
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>

                </div>


                <div className="text-sm md:text-xl">
                    <h1 className="uppercase">{studentInfo?.first_name || "Deleted"} {studentInfo?.last_name || "User"}</h1>
                    <h2>{studentInfo?.email || "unavailable"}</h2>
                    <h2>{studentInfo?.phone || "unavailable"}</h2>
                </div>
            </div>





            <div role="tablist" className="tabs tabs-lifted">

                {/* tab 1 */}
                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Grades" defaultChecked />

                <div role="tabpanel" className="tab-content p-6 border-base-300 rounded-box overflow-hidden">
                    <StudentGradesTab />
                </div>


                {/* tab 2 */}
                <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    className="tab"
                    aria-label="Attendance"
                />
                <div role="tabpanel" className="tab-content p-6 border-base-300 rounded-box overflow-hidden">
                    <StudentAttendanceTab studentInfo={studentInfo} />
                </div>
            </div>

        </div>
    );
};

export default StudentAcademicInfo;