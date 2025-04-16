import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SectionHeading from "../../Utilities/SectionHeading";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { handleError } from "../../Utilities/handleError";
import StudentGradesTable from "../../Utilities/StudentGradesTable";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";


const StudentGradeFormAndList = ({ course_id }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();


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

console.log(existingGrades);

  const handleGradesTableDelete = async ()=>{
    const allGradesIds = existingGrades.map(id=> id._id);

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
              const res = await axiosSecure.delete(`/studentGrades/deleteAllGrades/${course_id}`, {data: {allGradesIds}});

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



  return (
    <div className="mt-10">
      <SectionHeading title="Student Grade Management" />
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

                <button onClick={()=>handleGradesTableDelete()} className={`btn btn-error ${existingGrades.length > 0 ? "block" : "hidden"} text-white flex`}><MdDelete /> Delete</button>
              </div>

              <div className="overflow-x-auto">
                <table className="table">
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
                    </tr>
                  </thead>

                  <tbody>
                    {existingGrades.map((singleGrade, idx) =>
                      <tr key={singleGrade._id}>
                        <th>{idx + 1}</th>

                        <td>{singleGrade.student_id.user_name}</td>

                        <td>{singleGrade.student_id.first_name} {singleGrade.student_id.last_name}</td>

                        <td>{singleGrade.obtained_marks}/{singleGrade.full_marks}</td>

                        <td>{singleGrade.percentage}%</td>
                        <td>{singleGrade.remarks}</td>

                        <td>{singleGrade.faculty_id.first_name} {singleGrade.faculty_id.last_name}</td>
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