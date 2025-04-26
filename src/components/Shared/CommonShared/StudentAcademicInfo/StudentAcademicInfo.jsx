import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query"
import SectionHeading from "../../../Utilities/SectionHeading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import StudentGradesTab from "./StudentGradesTab";



const StudentAcademicInfo = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    // fetch grades
    const { data: studentGrades = [], isPending: studentGradesIsPending, isError: studentGradesIsError, error: studentGradesError } = useQuery({
        queryKey: [],
        queryFn: async () => {
            const res = await axiosSecure.get(`/studentGrades/student/${id}`);

            return res.data.data;
        },
        enabled: !!id
    })

    const studentBasicInfo = studentGrades[0]?.student_id || "Deleted/Unavailable User";



    return (
        <div className="flex-1 p-3 md:p-8 overflow-hidden">
            <SectionHeading title="Academic Details" />


            {/* student details */}
            <div className="flex border space-x-1 items-center p-3 rounded-lg mx-auto justify-center mb-10">
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
                    <h1 className="uppercase">{studentBasicInfo?.first_name || "Deleted"} {studentBasicInfo?.last_name || "User"}</h1>
                    <h2>{studentBasicInfo?.email || "unavailable"}</h2>
                    <h2>{studentBasicInfo?.phone || "unavailable"}</h2>
                </div>
            </div>





            <div role="tablist" className="tabs tabs-lifted">

                {/* tab 1 */}
                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Grades" defaultChecked />

                <div role="tabpanel" className="tab-content p-6 border-base-300 rounded-box overflow-hidden">
                    <StudentGradesTab
                        studentGrades={studentGrades} studentGradesIsPending={studentGradesIsPending}
                        studentGradesIsError={studentGradesIsError}
                        studentGradesError={studentGradesError}
                    />
                </div>


                {/* tab 2 */}
                <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    className="tab"
                    aria-label="Attendance"
                />
                <div role="tabpanel" className="tab-content p-6 border-base-300 rounded-box">
                    Tab 2: Attendance Table (download pdf)
                </div>
            </div>

        </div>
    );
};

export default StudentAcademicInfo;