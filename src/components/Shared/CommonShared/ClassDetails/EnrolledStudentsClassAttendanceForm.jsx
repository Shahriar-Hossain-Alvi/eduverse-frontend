import { useQuery } from "@tanstack/react-query";
import SectionHeading from "../../../Utilities/SectionHeading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import { CgClose, CgSpinnerTwoAlt } from "react-icons/cg";
import { MdClose } from "react-icons/md";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import { FiEdit, FiSave } from "react-icons/fi";
import Swal from "sweetalert2";
import { isEqual } from "lodash";
import { handleError } from "../../../Utilities/HandleError";



const EnrolledStudentsClassAttendanceForm = ({ course_id, class_id, scheduled_time }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const current_date = startOfDay(new Date());
    const class_date = startOfDay(parseISO(scheduled_time));

    // Check if current date is on or after the class date
    const isDateAllowed = isEqual(current_date, class_date) || isAfter(current_date, class_date);


    const [attendanceData, setAttendanceData] = useState([]);
    const [showAttendanceForm, setShowAttendanceForm] = useState(false);
    const [formSubmissionLoading, setFormSubmissionLoading] = useState(false);
    const [showAttendanceUpdate, setShowAttendanceUpdate] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editingStudentData, setEditingStudentData] = useState({});


    const { reset, handleSubmit } = useForm();

    // fetch attendance data
    const { data: studentsAttendanceRecord = {}, isPending, isError, error, refetch } = useQuery({
        queryKey: [],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classAttendance/${class_id}`);


            return res.data.data;
        },
        enabled: !!class_id
    });

    const isRecordExists = studentsAttendanceRecord && (
        (Array.isArray(studentsAttendanceRecord) && studentsAttendanceRecord.length > 0) ||
        (typeof studentsAttendanceRecord === "object" && Object.keys(studentsAttendanceRecord).length > 0)
    );



    // fetch enrolled student list
    const { data: studentListForAttendance = [], isError: studentListForAttendanceIsError, error: studentListForAttendanceError, isPending: studentListForAttendanceIsPending } = useQuery({
        queryKey: ["attendanceStudentList", course_id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseStudentEnrollment/enrollmentList/${course_id}`) // fetch enrolled students using course id

            return res.data.data;
        },
        enabled: !!course_id && user.user_role !== "student" // Runs only when course_id is available
    });


    // Initialize attendance data when student list is loaded 
    useEffect(() => {
        if (studentListForAttendance && studentListForAttendance.length > 0) {
            // pre populate attendance data
            const initialAttendanceData = studentListForAttendance.map(student => ({
                student_id: student.users_id._id,
                is_present: "absent",
                remarks: ""
            }));
            setAttendanceData(initialAttendanceData)
        }
    }, [studentListForAttendance])



    // handle attendance input dynamically
    const handleAttendanceChange = (student_id, field, value) => {
        setAttendanceData(prevData => {
            // Create a copy of the array
            const updatedData = [...prevData];

            // Find the index of the student in the array
            const studentIndex = updatedData.findIndex(record => record.student_id === student_id);


            // If student exists in the array, update their record
            if (studentIndex !== -1) {
                updatedData[studentIndex] = {
                    ...updatedData[studentIndex],
                    [field]: value
                };
            } else {
                // If student doesn't exist, add a new record
                updatedData.push({
                    student_id,
                    is_present: field === "is_present" ? value : "absent",
                    remarks: field === "remarks" ? value : ""
                });
            }


            return updatedData;
        });
    };


    // save attendance button
    const handleAddClassAttendance = async () => {
        // Make sure all students have an attendance record
        if (attendanceData.length !== studentListForAttendance.length) {
            toast.error("Please mark attendance for all students", {
                duration: 2500,
                position: "top-center"
            });
            return;
        }

        // Prepare data according to schema
        const attendance_for = format(new Date(scheduled_time), "MMMM d, yyyy");

        const finalData = {
            class_id,
            created_by: user._id,
            attendance_date: attendance_for,
            attendance_record: attendanceData
        };

        try {
            setFormSubmissionLoading(true);
            const res = await axiosSecure.post("/classAttendance", finalData);

            if (res.data.success) {
                toast.success(res.data.message, {
                    duration: 2500,
                    position: "top-center"
                })
                reset();
                setFormSubmissionLoading(false);
                setShowAttendanceForm(false);
                refetch();
            }
        } catch (error) {
            handleError(error, "Failed to save class attendance");
            reset();
            setFormSubmissionLoading(false);
            setShowAttendanceForm(false);
        }
    }


    // delete attendance table
    const handleAttendanceDelete = async () => {
        const attendance_id = studentsAttendanceRecord._id;

        const swalResponse = await Swal.fire({
            title: "Do you want to delete this attendance record?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#16A34A",
            confirmButtonText: "Yes, delete it!",
        })
        if (swalResponse.isConfirmed) {
            try {
                setFormSubmissionLoading(true);
                const res = await axiosSecure.delete(`/classAttendance/${attendance_id}`);

                if (res.data.success) {
                    refetch();
                    setFormSubmissionLoading(false);
                    toast.success(res.data.message, {
                        duration: 1500,
                        position: "top-center"
                    })
                }
            } catch (error) {
                handleError(error, "Failed to delete class attendance");
                refetch();
                setFormSubmissionLoading(false);
            }
        }
    }


    // get edited data
    const getEditedData = (student_id, field, value) => {
        setEditingStudentData(prev => ({
            ...prev,
            [student_id]: {
                ...prev[student_id],
                [field]: value
            }
        }));
    };


    const handleSingleStudentUpdate = async (studentId) => {
        // Find the current record for the specific student
        const currentStudentRecord = studentsAttendanceRecord.attendance_record.find(
            record => record.student_id._id === studentId
        );


        // Prepare the update data for the specific student
        const updateData = {
            student_id: studentId,
            is_present: editingStudentData[studentId]?.is_present || currentStudentRecord.is_present,
            remarks: editingStudentData[studentId]?.remarks || currentStudentRecord.remarks
        };


        try {
            // Validate the update data
            if (!updateData.is_present) {
                toast.error("Please select attendance status", {
                    duration: 2500,
                    position: "top-center"
                });
                return;
            }

            // Prepare the full payload for update
            const finalUpdateData = {
                attendance_id: studentsAttendanceRecord._id,
                attendance_record: [updateData]
            };

            // Send update request
            const res = await axiosSecure.patch(`/classAttendance/${studentsAttendanceRecord._id}`, finalUpdateData);

            if (res.data.success) {
                toast.success("Attendance updated successfully", {
                    duration: 2500,
                    position: "top-center"
                });

                // Reset editing states
                setShowAttendanceUpdate(false);
                setEditingStudentData({});

                // Refetch the latest attendance data
                refetch();
            }
        } catch (error) {
            handleError(error, "Failed to update attendance");
        }
    };

    return (
        <div>
            <SectionHeading title="Class Attendance" />


            {/* attendance form */}
            <div>
                {/* error message for attendance form */}
                {studentListForAttendanceIsError && <TanstackQueryErrorMessage errorMessage={studentListForAttendanceError.message} />}


                {/* loading if the student list is loading */}
                {
                    studentListForAttendanceIsPending ? <LoadingSpinner />
                        :
                        // show the create attendance button after student list is loaded
                        <div className="mb-3">
                            {
                                !isRecordExists && showAttendanceForm ?
                                    <button
                                        onClick={() => {
                                            setShowAttendanceForm(!showAttendanceForm);
                                            reset();
                                        }} className="btn btn-error text-white">
                                        <MdClose />
                                        Cancel
                                    </button>
                                    :
                                    !isRecordExists &&
                                    <button
                                        disabled={!isDateAllowed}
                                        onClick={() => setShowAttendanceForm(!showAttendanceForm)} className="btn btn-success text-white">
                                        <FaPlus />
                                        Add Attendance
                                    </button>
                            }
                        </div>
                }

                {/* attendance form starts here */}
                {
                    showAttendanceForm &&
                    <form onSubmit={handleSubmit(handleAddClassAttendance)}>
                        {studentListForAttendance.map(singleStudent => <div key={singleStudent._id} className="border p-2 grid grid-cols-3 gap-2 items-center">

                            {/* student name */}
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Name</span>
                                </div>
                                <input className="input input-bordered w-full" readOnly defaultValue={`${singleStudent.users_id.first_name} ${singleStudent.users_id.last_name}`} />
                            </label>


                            {/* select attendance */}
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Select Attendance</span>
                                </div>
                                <div>
                                    <select defaultValue="absent"
                                        onChange={e => handleAttendanceChange(singleStudent.users_id._id, "is_present", e.target.value)}
                                        className="select select-bordered w-full">
                                        <option value="present" className="text-success font-bold">Present</option>

                                        <option value="absent" className="text-error font-bold">Absent</option>

                                        <option value="early leave" className="text-warning font-bold">Early Leave</option>

                                        <option value="late" className="text-warning font-bold">Late</option>
                                    </select>
                                </div>
                            </label>


                            {/* remarks */}
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Remarks</span>
                                </div>
                                <div>
                                    <input type="text"
                                        onChange={e => handleAttendanceChange(singleStudent.users_id._id, "remarks", e.target.value)}
                                        placeholder="Type here" className="input input-bordered w-full" />
                                </div>
                            </label>
                        </div>)}

                        {/* submit button */}
                        {
                            formSubmissionLoading ?
                                <button type="submit" className="btn btn-disabled btn-wide mt-3 text-white">
                                    <CgSpinnerTwoAlt className="animate-spin" />
                                </button>
                                :
                                <button type="submit" className="btn btn-success btn-wide mt-3 text-white">
                                    Save
                                </button>
                        }
                    </form>
                }
            </div>


            {/* show recorded attendance */}
            <div>
                {/* error message */}
                {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

                {isPending && <LoadingSpinner />}

                {(!isPending && Object.keys(studentsAttendanceRecord).length > 0) &&
                    <div>
                        <div className="grid grid-cols-5 items-center gap-1">
                            <h2 className="col-span-2 text-sm md:text-lg font-medium">Attendance of: {format(new Date(studentsAttendanceRecord.attendance_date), "MMMM d, yyyy")}</h2>

                            <h3 className="col-span-2 md:text-lg text-sm font-medium">Recorded By: {studentsAttendanceRecord.created_by.first_name} {studentsAttendanceRecord.created_by.last_name}</h3>

                            {
                                user.user_role !== "student" && formSubmissionLoading
                                    ?
                                    <button className="btn btn-disabled">
                                        <CgSpinnerTwoAlt className="animate-spin" />
                                    </button>
                                    :
                                    user.user_role !== "student" &&
                                    <button onClick={() => handleAttendanceDelete()} className="btn btn-error text-xs md:text-base btn-sm text-white p-0">
                                        Delete <FaTrash />
                                    </button>
                            }
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table table-sm md:table-md">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Name</th>
                                        <th>Attendance</th>
                                        <th>Remarks</th>
                                        {user.user_role !== "student" && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        studentsAttendanceRecord.attendance_record.map((singleRecord, index) => <tr key={singleRecord._id}>
                                            <th className="text-xs md:text-base">{index + 1}</th>

                                            <td className="text-xs md:text-base">{singleRecord.student_id.first_name} {singleRecord.student_id.last_name}</td>

                                            {
                                                showAttendanceUpdate ?
                                                    <td>
                                                        {/* select attendance */}
                                                        <label className="form-control w-full">
                                                            <div className="label">
                                                                <span className="text-xs md:label-text">Select Attendance</span>
                                                            </div>
                                                            <div>
                                                                <select
                                                                    disabled={editingStudent !== singleRecord.student_id._id}
                                                                    defaultValue={singleRecord.is_present}
                                                                    onChange={e => getEditedData(
                                                                        singleRecord.student_id._id,
                                                                        "is_present",
                                                                        e.target.value
                                                                    )}
                                                                    className="select select-sm md:select-md select-bordered w-full">
                                                                    <option value="present" className="text-success font-bold">Present</option>

                                                                    <option value="absent" className="text-error font-bold">Absent</option>

                                                                    <option value="early leave" className="text-warning font-bold">Early Leave</option>

                                                                    <option value="late" className="text-warning font-bold">Late</option>
                                                                </select>
                                                            </div>
                                                        </label>
                                                    </td>
                                                    :
                                                    <td className="capitalize flex items-center gap-2 text-xs md:text-base">
                                                        {singleRecord.is_present}

                                                        {singleRecord.is_present === "present" && <div className="badge badge-success rounded-full badge-xs"></div>}
                                                        {singleRecord.is_present === "absent" && <div className="badge badge-error rounded-full badge-xs"></div>}
                                                        {singleRecord.is_present === "late" && <div className="badge badge-warning rounded-full badge-xs"></div>}
                                                        {singleRecord.is_present === "early leave" && <div className="badge badge-info rounded-full badge-xs"></div>}

                                                    </td>}

                                            {
                                                showAttendanceUpdate ?
                                                    <td>
                                                        {/* remarks */}
                                                        <label className="form-control w-full max-w-xs">
                                                            <div className="label">
                                                                <span className="label-text">Remarks</span>
                                                            </div>
                                                            <div>
                                                                <input type="text"
                                                                    disabled={editingStudent !== singleRecord.student_id._id}
                                                                    onChange={e => getEditedData(
                                                                        singleRecord.student_id._id,
                                                                        "remarks",
                                                                        e.target.value
                                                                    )}
                                                                    defaultValue={singleRecord.remarks}
                                                                    placeholder="Type here" className="input input-bordered input-sm md:input-md w-full" />
                                                            </div>
                                                        </label>
                                                    </td>
                                                    :
                                                    <td>{singleRecord.remarks}</td>}

                                            {
                                                user.user_role !== "student" && !showAttendanceUpdate &&
                                                <td>
                                                    <button
                                                        onClick={() => {
                                                            setEditingStudent(singleRecord.student_id._id);
                                                            setShowAttendanceUpdate(true);
                                                        }}
                                                        className="text-blue-500 hover:text-blue-600 mr-2"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                </td>
                                            }
                                            {
                                                user.user_role !== "student" && showAttendanceUpdate &&
                                                editingStudent === singleRecord.student_id._id &&
                                                (
                                                    <td>
                                                        <button
                                                            className="text-sm md:text-lg bg-success text-white btn-sm md:mr-1"
                                                            onClick={() => handleSingleStudentUpdate(singleRecord.student_id._id)}
                                                        >
                                                            <FiSave />
                                                        </button>


                                                        <button
                                                            onClick={() => {
                                                                setShowAttendanceUpdate(false);
                                                                setEditingStudentData({});
                                                                setEditingStudent(null);
                                                            }}
                                                            className="text-sm md:text-lg bg-error text-white btn-sm md:mr-1"
                                                        >
                                                            <CgClose />
                                                        </button>
                                                    </td>
                                                )
                                            }
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>}

            </div>
        </div >
    );
};

EnrolledStudentsClassAttendanceForm.propTypes = {
    course_id: PropTypes.string,
    class_id: PropTypes.string,
    scheduled_time: PropTypes.string
}


export default EnrolledStudentsClassAttendanceForm;