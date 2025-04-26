import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { format } from "date-fns";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import SectionHeading from "../../Utilities/SectionHeading";
import ClassMaterialFormAndList from "../../Shared/CommonShared/ClassDetails/ClassMaterialFormAndList";



const EnrolledCoursesClassDetails = () => {
    const { id } = useParams(); //class_id
    const axiosSecure = useAxiosSecure();

    // class details
    const { data: singleClassDetails = {}, isError, isPending, error } = useQuery({
        queryKey: ["singleClassDetails", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/${id}`);

            return res.data.data;
        },
        enabled: !!id
    })

    const { description, location, scheduled_time, title } = singleClassDetails;



    // fetch attendance data
    const { data: studentsClassAttendanceRecord = {}, isPending: studentsAttendanceRecordIsPending, isError: studentsAttendanceRecordIsError, error: studentsAttendanceRecordError } = useQuery({
        queryKey: ["studentsClassAttendanceRecord", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classAttendance/${id}`);


            return res.data.data;
        },
        enabled: !!id
    });

    if (isPending) return <LoadingSpinner />


    return (
        <div className="flex-1 p-3 md:p-8">
            {/* error message */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <h1 className="text-center font-semibold text-4xl mb-8 underline">CLASS DETAILS</h1>

            {/* title and description */}
            <SectionHeading title={`Title: ${title}`} />

            <p className="font-medium text-lg mb-5">{description}</p>

            {/* time and location */}
            <div className="flex items-center py-5">
                <div className="w-2/5 space-y-2">

                    <p className="font-medium">
                        <span className="underline mr-1">Date:</span>

                        {scheduled_time? format(new Date(scheduled_time), "MMMM d, yyyy") : "Loading..."}
                    </p>


                    <p className="font-medium">
                        <span className="underline mr-1">Time:</span>

                        {scheduled_time ? format(new Date(scheduled_time), "hh:mm a") : "Loading..."}
                    </p>
                </div>

                <div className="divider divider-horizontal divider-success w-1/5"></div>

                <p className="text-lg w-2/5"><span className="font-medium underline">Location:</span> {location}</p>
            </div>


            {/* class materials */}
            <ClassMaterialFormAndList class_id={id} />


            {/* Class attendance */}
            <div>
                <SectionHeading title="Class Attendance" />

                {/* error message */}
                {studentsAttendanceRecordIsError && <TanstackQueryErrorMessage errorMessage={studentsAttendanceRecordError.message} />}


                <div>


                    {studentsAttendanceRecordIsPending && <LoadingSpinner />}

                    {(!isPending && Object.keys(studentsClassAttendanceRecord).length > 0) &&
                        <div>
                            <div className="grid grid-cols-5 items-center">
                                <h2 className="col-span-2 text-lg font-medium">Attendance of: {format(new Date(studentsClassAttendanceRecord.attendance_date), "MMMM d, yyyy")}</h2>

                                <h3 className="col-span-2 text-lg font-medium">Recorded By: {studentsClassAttendanceRecord.created_by.first_name} {studentsClassAttendanceRecord.created_by.last_name}</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Attendance</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            studentsClassAttendanceRecord.attendance_record.map((singleRecord, index) =>
                                                <tr key={singleRecord._id}>
                                                    <th>{index + 1}</th>

                                                    <td>{singleRecord.student_id.first_name} {singleRecord.student_id.last_name}</td>

                                                    <td className="capitalize flex items-center gap-2">
                                                        {singleRecord.is_present}
                                                        <div>
                                                            {singleRecord.is_present === "present" && <div className="badge badge-success rounded-full badge-xs"></div>}
                                                            {singleRecord.is_present === "absent" && <div className="badge badge-error rounded-full badge-xs"></div>}
                                                            {singleRecord.is_present === "late" && <div className="badge badge-warning rounded-full badge-xs"></div>}
                                                            {singleRecord.is_present === "early leave" && <div className="badge badge-info rounded-full badge-xs"></div>}
                                                        </div>
                                                    </td>


                                                    <td>{singleRecord.remarks}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>}

                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursesClassDetails;