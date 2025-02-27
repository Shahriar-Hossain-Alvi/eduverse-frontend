import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SectionHeading from "../../Utilities/SectionHeading";
import { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiLink } from "react-icons/fi";
import EnrolledStudentList from "../../Shared/EnrolledStudentList";
import ClassScheduleForm from "../../Shared/ClassScheduleForm";

// todo:
//     <h1>Show list of total enrolled students.</h1>
//     <h1>Show/option to create/schedule a class for this course (admin & faculty).</h1>
//     <h1>Show/option to upload course materials (admin & faculty)</h1>


const SingleAssignedCourseDetails = () => {

    const { id } = useParams(); // courseFacultyAssignments id
    const axiosSecure = useAxiosSecure();


    const [materials, setMaterials] = useState([])
    const [showMaterialForm, setShowMaterialForm] = useState(false);
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


    if (isPending) return <LoadingSpinner />


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
            {/* Error messages */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {/* title and description */}
            <SectionHeading title={course_id.title} />

            <p className="font-medium text-lg mb-5">{course_id.description}</p>



            {/* enrolled student list */}
            <EnrolledStudentList course_id={course_id._id} />



            {/* class schedules form*/}
            <ClassScheduleForm course_id={course_id._id} faculty={users_id} />



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