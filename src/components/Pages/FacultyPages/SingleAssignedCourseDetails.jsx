import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SectionHeading from "../../Utilities/SectionHeading";
import { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiLink } from "react-icons/fi";

// todo:
//     <h1>Show list of total enrolled students.</h1>
//     <h1>Show/option to create/schedule a class for this course (admin & faculty).</h1>
//     <h1>Show/option to upload course materials (admin & faculty)</h1>


const SingleAssignedCourseDetails = () => {

    const { id } = useParams(); // courseFacultyAssignments id
    const axiosSecure = useAxiosSecure();

    const [schedules, setSchedules] = useState([])
    const [materials, setMaterials] = useState([])
    const [showScheduleForm, setShowScheduleForm] = useState(false)
    const [showMaterialForm, setShowMaterialForm] = useState(false)
    const [scheduleForm, setScheduleForm] = useState({ title: "", description: "", scheduled_time: "" })
    const [materialForm, setMaterialForm] = useState({ title: "", type: "file", file: null, url: "" })

    // fetch single assigned course details using courseFacultyAssignments id
    const { data: singleAssignedCourse = [], isError, error, isPending } = useQuery({
        queryKey: ["singleAssignedCourse", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseFacultyAssignments/${id}`)

            return [res.data.data];
        }
    });

    const singleAssignedCourseObject = singleAssignedCourse[0] || {};

    const { course_id, // oject
        is_active,
        users_id, // array
    } = singleAssignedCourseObject;


    // fetch enrolled students using course id
    const { data: singleAssignedCourseEnrollmentList = [], isError: isEnrollmentError, isPending: isEnrollmentPending } = useQuery({
        queryKey: ["singleAssignedCourseEnrollmentList", course_id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courseStudentEnrollment/enrollmentList/${course_id?._id}`) // fetch enrolled students using course id

            return res.data.data;
        },
        enabled: !!course_id // Runs only when course_id is available
    });

    console.log(singleAssignedCourseEnrollmentList);


    if (isPending || isEnrollmentPending) return <LoadingSpinner />


    const handleScheduleSubmit = (e) => {
        e.preventDefault()
        const newSchedule = { ...scheduleForm, id: Date.now() }
        setSchedules([...schedules, newSchedule])
        setScheduleForm({ title: "", description: "", scheduled_time: "" })
        setShowScheduleForm(false)
    }

    const handleScheduleDelete = (id) => {
        setSchedules(schedules.filter((schedule) => schedule.id !== id))
    }

    const handleScheduleUpdate = (id) => {
        const scheduleToUpdate = schedules.find((schedule) => schedule.id === id)
        setScheduleForm(scheduleToUpdate)
        setShowScheduleForm(true)
    }



    const handleMaterialSubmit = (e) => {
        e.preventDefault()
        const newMaterial = { ...materialForm, id: Date.now() }
        setMaterials([...materials, newMaterial])
        setMaterialForm({ title: "", type: "file", file: null, url: "" })
        setShowMaterialForm(false)
        // Here you would typically handle the file upload to Cloudinary
    }

    return (
        <div className="flex-1 p-3 md:p-8">
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}
            {isEnrollmentError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <SectionHeading title={course_id.title} />

            <p className="font-medium text-lg mb-5">{course_id.description}</p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Enrolled Students</h2>

            {/* enrolled student list */}
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {singleAssignedCourseEnrollmentList.map((student, index) => (
                            <tr key={student._id}>
                                <th>{index + 1}</th>
                                <td>{student.users_id.first_name} {student.users_id.last_name}</td>
                                <td>{student.users_id.email}</td>
                                <td><Link to={`/StudentAcademicInfo/${student.users_id._id}`} className="btn btn-success btn-sm text-white">Profile</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Class Schedules</h2>
            <button
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                <FiPlus className="mr-2" /> Add New Schedule
            </button>

            {showScheduleForm && (
                <form onSubmit={handleScheduleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <input
                        type="text"
                        placeholder="Title"
                        value={scheduleForm.title}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                        className="mb-2 w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={scheduleForm.description}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                        className="mb-2 w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="datetime-local"
                        value={scheduleForm.scheduled_time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, scheduled_time: e.target.value })}
                        className="mb-2 w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Save Schedule
                    </button>
                </form>
            )}

            <ul className="space-y-2">
                {schedules.map((schedule) => (
                    <li key={schedule.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                        <div>
                            <h3 className="font-semibold">{schedule.title}</h3>
                            <p className="text-sm text-gray-600">{schedule.description}</p>
                            <p className="text-sm text-gray-500">{new Date(schedule.scheduled_time).toLocaleString()}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleScheduleUpdate(schedule.id)}
                                className="text-blue-500 hover:text-blue-600 mr-2"
                            >
                                <FiEdit />
                            </button>
                            <button onClick={() => handleScheduleDelete(schedule.id)} className="text-red-500 hover:text-red-600">
                                <FiTrash2 />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">Course Materials</h2>
            <button
                onClick={() => setShowMaterialForm(!showMaterialForm)}
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                <FiPlus className="mr-2" /> Add New Material
            </button>

            {showMaterialForm && (
                <form onSubmit={handleMaterialSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <input
                        type="text"
                        placeholder="Title"
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                        className="mb-2 w-full p-2 border rounded"
                        required
                    />
                    <select
                        value={materialForm.type}
                        onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                        className="mb-2 w-full p-2 border rounded"
                    >
                        <option value="file">File Upload</option>
                        <option value="url">External URL</option>
                    </select>
                    {materialForm.type === "file" ? (
                        <input
                            type="file"
                            onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                            className="mb-2 w-full p-2 border rounded"
                            required
                        />
                    ) : (
                        <input
                            type="url"
                            placeholder="External URL"
                            value={materialForm.url}
                            onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                            className="mb-2 w-full p-2 border rounded"
                            required
                        />
                    )}
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Upload Material
                    </button>
                </form>
            )}

            <ul className="space-y-2">
                {materials.map((material) => (
                    <li key={material.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                        <div>
                            <h3 className="font-semibold">{material.title}</h3>
                            <p className="text-sm text-gray-600">{material.type === "file" ? "Uploaded File" : "External URL"}</p>
                        </div>
                        <div>
                            {material.type === "file" ? (
                                <FiUpload className="text-green-500" />
                            ) : (
                                <FiLink className="text-blue-500" />
                            )}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default SingleAssignedCourseDetails;