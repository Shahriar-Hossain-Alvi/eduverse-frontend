import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";
import { FaEdit, FaPlus, FaSave } from "react-icons/fa";
import { MdClose, MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { handleError } from "../../Utilities/handleError";


const StudentGradeFormAndList = ({ course_id }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [gradesFormLoading, setGradesFormLoading] = useState(false);
  const [showGradesFrom, setShowGradesForm] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullMarks: 100,
      remarks: ""
    }
  });

  const toggleEdit = (id) => {
    setIsEditing(true);
    setEditingRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  // Fetch enrolled students using course id
  const {
    data: enrolledStudents = [],
    isError: isEnrolledStudentsError,
    error: enrolledStudentsError,
    isPending: isEnrolledStudentsPending,
    refetch
  } = useQuery({
    queryKey: ["enrolledStudentsList", course_id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courseStudentEnrollment/enrollmentList/${course_id}`);
      return res.data.data;
    },
    enabled: !!course_id
  });



  // Fetch existing grades for the selected course
  const {
    data: existingGrades = [],
    isPending: gradesLoading,
    isError: gradesError,
    error: gradesErrorData,
    refetch: refetchGrades,
  } = useQuery({
    queryKey: ["existingGrades", course_id],
    queryFn: async () => {
      if (!course_id) return [];
      const res = await axiosSecure.get(`/studentGrades/course/${course_id}`);
      return res.data.data;
    },
    enabled: !!course_id,
  });


  const handleGradeSave = async (data) => {
    const faculty_id = user?._id;
    const student_id = data.userId;
    const obtained_marks = data.obtainedMarks ? parseFloat(data.obtainedMarks) : null;
    const full_marks = data.fullMarks ? parseFloat(data.fullMarks) : null;
    const remarks = data.remarks;


    if (!course_id || !faculty_id || !student_id) {
      return toast.error("Course/Faculty/Student Id is missing", {
        duration: 2500,
        position: "top-center"
      })
    }


    if (obtained_marks === null || isNaN(obtained_marks)) {
      return toast.error("Obtained Mark is missing or invalid", {
        duration: 2500,
        position: "top-center"
      })
    }

    if (full_marks === null || isNaN(full_marks)) {
      return toast.error("Full Mark is missing or invalid", {
        duration: 2500,
        position: "top-center"
      })
    }



    const gradesData = {
      course_id, student_id, faculty_id, obtained_marks, full_marks, remarks
    }

    try {
      setGradesFormLoading(true)
      const res = await axiosSecure.post("/studentGrades", gradesData);

      if (res.data.success) {
        refetch();
        refetchGrades();
        reset();
        setGradesFormLoading(false);
        setIsEditing(false);
        setEditingRows({});
        toast.success(res.data.message, {
          duration: 1500,
          position: "top-center"
        })
      }

    } catch (error) {
      handleError(error, "Failed to save grades for this student");
      setGradesFormLoading(false);
    }
  };


  if (isEnrolledStudentsPending) return <LoadingSpinner />;



  return (
    <div className="mt-10">
      <SectionHeading title="Student Grade Management" />
      <Toaster />
      {isEnrolledStudentsError && (
        <TanstackQueryErrorMessage errorMessage={enrolledStudentsError.message} />
      )}

      <div>

        {
          showGradesFrom ?
            <button onClick={() => setShowGradesForm(false)} className="btn btn-error text-white mb-5"><MdClose /> Cancel</button>
            :
            <button onClick={() => setShowGradesForm(true)} className="btn bg-blue-500 hover:bg-blue-600 text-white mb-5"><FaPlus /> Add Grades</button>
        }

        {
          enrolledStudents.length === 0 ? <h2>No student enrollment found for this course</h2>
            :

            <div className={`border p-2 space-y-3 ${showGradesFrom ? "block" : "hidden"}`}>
              <div className={`grid ${isEditing ? "grid-cols-5 text-center" : "grid-cols-3 text-left"} gap-2 border-b pb-2`}>
                <h2>Student Name</h2>
                {!isEditing && <>
                  <h2>Student Email</h2>
                  <h2>Add Grade</h2>
                </>}
                {
                  isEditing && <>
                    <h2>Obtained Marks</h2>
                    <h2>Full Marks</h2>
                    <h2>Remarks</h2>
                    <h2>Action</h2>
                  </>
                }
              </div>


              <div>
                {
                  enrolledStudents.map(singleStudent =>
                    <div key={singleStudent._id} className={`grid ${isEditing ? "grid-cols-5" : "grid-cols-3"} p-2  items-center`}>
                      <h2 className="font-medium">{singleStudent?.users_id.first_name} {singleStudent?.users_id.last_name}</h2>

                      {!isEditing && <h2 className="font-medium">{singleStudent?.users_id.email}</h2>}

                      {!isEditing && <button onClick={() => toggleEdit(singleStudent._id)} className="btn text-center mx-auto bg-blue-500 hover:bg-blue-600 text-white btn-sm"><FaPlus /></button>}


                      {editingRows[singleStudent._id] && isEditing && <form onSubmit={handleSubmit(handleGradeSave)} className="col-span-4 grid grid-cols-4 gap-2">

                        {/* ✅ Hidden input to pass user ID */}
                        <input
                          type="hidden"
                          value={singleStudent.users_id._id}
                          {...register("userId")}
                        />

                        {/* obtained marks */}
                        <div>
                          <input type="number" placeholder="Marks" className="input input-bordered w-full" {...register("obtainedMarks", { required: "Obtained Mark is required" })} />

                          {errors.obtainedMarks && <p className="text-error font-medium text-sm mb-2">{errors.obtainedMarks.message}</p>}
                        </div>


                        {/* full marks */}
                        <div>
                          <input type="number" placeholder="Marks" className="input input-bordered w-full" {...register("fullMarks", { required: "Full Mark is required" })} />

                          {errors.fullMarks && <p className="text-error font-medium text-sm mb-2">{errors.fullMarks.message}</p>}
                        </div>


                        {/* remarks */}
                        <div>
                          <input type="text" placeholder="Remarks" className="input input-bordered w-full" {...register("remarks")} />

                          {errors.remarks && <p className="text-error font-medium text-sm mb-2">{errors.remarks.message}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={gradesFormLoading}
                            className="btn btn-success text-white"><FaSave className="text-md" /></button>


                          <button type="button"
                            disabled={gradesFormLoading}
                            onClick={() => {
                              setIsEditing(false);
                              reset();
                              setEditingRows({});
                            }}
                            className="btn btn-error text-white"><FaEdit className="text-md" /></button>
                        </div>
                      </form>}
                    </div>
                  )
                }
              </div>
            </div>
        }
      </div>


    </div>
  );
};

StudentGradeFormAndList.propTypes = {
  course_id: PropTypes.string
};

export default StudentGradeFormAndList;