import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query"



const StudentAcademicInfo = () => {
    const { id } = useParams();

    const { data: studentAcademicInfo = [], isPending, isError, error } = useQuery({
        queryKey: [],
        queryFn: async () => {



        }
    })

    console.log(id);


    return (
        <div className="flex-1 p-3 md:p-8">
            <h1>Student Academic Details, Grades, Marks, Attendance</h1>

            Tab 1: name, username, email, phone number, total enrolled courses

            Tab 2: Grades Table (download pdf)

            Tab 3: Attendance Table (download pdf)

        </div>
    );
};

export default StudentAcademicInfo;