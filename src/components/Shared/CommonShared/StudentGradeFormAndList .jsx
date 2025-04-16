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


  return (
    <div className="mt-10">
      <SectionHeading title="Student Grade Management" />
      <Toaster />

      {/* grades form */}
      {
        user?.user_role === "faculty" && <StudentGradesTable course_id={course_id} refetchGrades={refetchGrades} existingGradesLength={existingGrades.length} />
      }




      {/* grades table */}
      {gradesError && (
        <TanstackQueryErrorMessage errorMessage={gradesErrorData.message} />
      )}


      {gradesLoading && <LoadingSpinner />}

      {
        existingGrades.length === 0 ?
          <div>
            <h1>Grades are not added yet</h1>
          </div>

          :

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
                    <th>{idx+1}</th>

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
      }

    </div>
  );
};

StudentGradeFormAndList.propTypes = {
  course_id: PropTypes.string
};

export default StudentGradeFormAndList;