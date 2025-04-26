import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import PropTypes from 'prop-types';
import toast, { Toaster } from "react-hot-toast";
import { handleError } from "../../Utilities/handleError";
import StudentGradesTable from "../../Utilities/StudentGradesTable";
import { MdCancel, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { FaEdit, FaSave } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router";



const StudentGradeFormAndList = ({ course_id }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [editGrade, setEditGrade] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [updatedMarks, setUpdatedMarks] = useState(null);
  const [updatedRemarks, setUpdatedRemarks] = useState("");


  // Fetch existing grades for the selected course
  const { data: existingGrades = [], isPending: gradesLoading, isError: gradesError, error: gradesErrorData, refetch: refetchGrades } = useQuery({
    queryKey: ["existingGrades", course_id],
    queryFn: async () => {
      if (!course_id) return [];
      const res = await axiosSecure.get(`/studentGrades/course/${course_id}`);
      return res.data.data;
    },
    enabled: !!course_id,
  });


  // delete all grades at once
  const handleGradesTableDelete = async () => {
    const allGradesIds = existingGrades.map(id => id._id);

    try {
      const swalResponse = await Swal.fire({
        title: `Delete All the grades at Once?`,
        text: "This can not be reversed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF0000",
        cancelButtonColor: "#16A34A",
        confirmButtonText: "Yes"
      });

      if (swalResponse.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/studentGrades/deleteAllGrades/${course_id}`, { data: { allGradesIds } });

          if (res.data.success === true) {
            refetchGrades();
            Swal.fire({
              title: "Deleted",
              text: `${res.data.message}`,
              icon: "success",
              confirmButtonColor: "#16A34A",
            });
          }
        } catch (error) {
          handleError(error, "Something went wrong! Please try again.");
        }
      }
    } catch (error) {
      handleError(error, "Assigned course could not be deleted")
    }
  }


  // activate single student row to add grades
  const toggleEdit = (id) => {
    setEditGrade(true);
    setEditingRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  // update grades button
  const handleSingleGradeUpdate = async (id) => {
    const updateDoc = {};
    const gradeId = id;

    const matchedGrade = existingGrades.find(grade => grade._id === gradeId);

    const getFullMarks = matchedGrade.full_marks;
    const getObtainedMarks = matchedGrade.obtained_marks;
    const getRemarks = matchedGrade.remarks;


    const updatedMarksNum = parseFloat(updatedMarks);


    if (updatedMarksNum > getFullMarks) {
      return toast.error("Obtained Marks can not exceed Full marks", {
        duration: 1500,
        position: "top-center"
      })
    }

    if (updatedMarks !== null && (updatedMarksNum !== getObtainedMarks)) {
      updateDoc.obtained_marks = updatedMarksNum;
    }


    if (updatedRemarks !== "" && updatedRemarks !== getRemarks) {
      updateDoc.remarks = updatedRemarks;
    }

    if (Object.keys(updateDoc).length === 0) {
      return toast.error("Nothing to update", {
        duration: 1500,
        position: "top-center"
      })
    }

    try {
      const res = await axiosSecure.patch(`/studentGrades/${gradeId}`, updateDoc);

      if (res?.data?.success) {
        toast.success("Grades Updated", {
          duration: 1500,
          position: "top-center"
        });
        refetchGrades();
        setEditGrade(false);
        setEditingRows({});
        setUpdatedRemarks("");
        setUpdatedMarks(null);
      }

    } catch (error) {
      handleError(error, "Failed to update grades");
    }
  }

  return (
    <div className="mt-10 overflow-hidden">
      <SectionHeading title="Student Grades" />
      <Toaster />


      {/* grades table */}
      <div>
        {gradesError && (
          <TanstackQueryErrorMessage errorMessage={gradesErrorData.message} />
        )}


        {gradesLoading && <LoadingSpinner />}

        {
          existingGrades.length === 0 ?
            <div>
              <h1 className="text-lg text-error font-medium text-center">Grades are not added yet</h1>
            </div>

            :

            <div>
              <div className="flex justify-between">
                <SectionHeading title="Final Marks for this course" />

                {user.user_role !== "student" && <button onClick={() => handleGradesTableDelete()} className={`btn btn-error btn-xs md:btn-sm lg:btn-md ${existingGrades.length > 0 ? "block" : "hidden"} text-white flex`}><MdDelete /> Delete</button>}
              </div>

              <div className="overflow-x-auto">
                <table className="table table-xs md:table-md">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Remarks</th>
                      <th>Graded By</th>
                      {
                        user.user_role !== "student" && <th>Action</th>
                      }
                      <th>View</th>
                    </tr>
                  </thead>

                  <tbody>
                    {existingGrades.map((singleGrade, idx) =>
                      <tr className="hover" key={singleGrade._id}>
                        <th>{idx + 1}</th>

                        <td>{singleGrade.student_id.user_name}</td>

                        <td>{singleGrade.student_id.first_name} {singleGrade.student_id.last_name}</td>

                        {/* marks */}
                        {
                          (editGrade && editingRows[singleGrade._id]) ?
                            <td><input
                              onChange={(e) => setUpdatedMarks(e.target.value)}
                              defaultValue={singleGrade.obtained_marks}
                              type="number" className="input input-bordered input-xs md:input-sm" placeholder={singleGrade.obtained_marks} /></td>
                            :
                            <td>{singleGrade.obtained_marks}/{singleGrade.full_marks}</td>
                        }


                        {/* percentage */}
                        <td className="text-center">{singleGrade.percentage.toFixed(2)}%</td>


                        {/* remarks */}
                        {
                          (editGrade && editingRows[singleGrade._id]) ?
                            <td><input onChange={(e) => setUpdatedRemarks(e.target.value)} type="text" className="input input-bordered input-xs md:input-sm" placeholder={singleGrade.remarks || "Update remarks"} /></td>
                            :
                            <td>{singleGrade.remarks}</td>
                        }

                        <td>{singleGrade.faculty_id.first_name} {singleGrade.faculty_id.last_name}</td>


                        {/* action */}
                        {
                          user.user_role !== "student" &&
                          <td className="flex gap-1">

                            {!editGrade && <button
                              onClick={() => {
                                toggleEdit(singleGrade._id)
                              }}
                              className="btn text-center mx-auto bg-blue-500 hover:bg-blue-600 text-white btn-xs md:btn-sm"><FaEdit /></button>}

                            {
                              (editGrade && editingRows[singleGrade._id]) && <>
                                <button
                                  onClick={() => handleSingleGradeUpdate(singleGrade._id)}
                                  className="btn btn-xs md:btn-sm btn-success text-white"><FaSave className="text-md" /></button>


                                <button type="button"

                                  onClick={() => {
                                    setEditGrade(false);
                                    setEditingRows({});
                                    setUpdatedRemarks("");
                                    setUpdatedMarks(null);
                                  }}
                                  className="btn btn-xs md:btn-sm btn-error text-white"><MdCancel className="text-md" /></button>
                              </>
                            }
                          </td>
                        }


                        {/* profile view */}
                        <td>
                          <Link to={`/${user?.user_role}/StudentAcademicInfo/${singleGrade.student_id._id}`} className="btn btn-success btn-sm text-white">Profile</Link>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
        }
      </div>



      {/* grades form */}
      {
        user?.user_role === "faculty" && <StudentGradesTable course_id={course_id} refetchGrades={refetchGrades} existingGradesLength={existingGrades.length} />
      }
    </div>
  );
};

StudentGradeFormAndList.propTypes = {
  course_id: PropTypes.string
};

export default StudentGradeFormAndList;