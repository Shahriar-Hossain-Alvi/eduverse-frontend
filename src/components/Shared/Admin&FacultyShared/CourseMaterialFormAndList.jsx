import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import SectionHeading from "../../Utilities/SectionHeading";
import { CgClose } from "react-icons/cg";
import { handleError } from "../../Utilities/HandleError";
import useAuth from "../../Hooks/useAuth";
import PropTypes from 'prop-types';
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import axios from "axios";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import TanstackQueryErrorMessage from "../../Utilities/TanstackQueryErrorMessage";
import Swal from "sweetalert2";




const CourseMaterialFormAndList = ({ course_id }) => {
    const myCloudName = import.meta.env.VITE_Cloudinary_Cloud_Name;
    const myUploadPreset = import.meta.env.VITE_Cloudinary_Upload_Preset;

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [showMaterialForm, setShowMaterialForm] = useState(false); // show/hide material form

    const [showUpdateCourseMaterialsForm, setShowUpdateCourseMaterialsForm] = useState(false); // show hide course material update form

    const [originalCourseMaterialData, setOriginalCourseMaterialData] = useState(null); // autofill current material data to the update form

    const [formSubmissionLoading, setFormSubmissionLoading] = useState(false);

    // hook form
    const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm();

    const materialType = watch("fileType", "file"); // watch the file type



    // get course materials
    const { data: courseMaterials = [], error, isError, isPending, refetch } = useQuery({
        queryKey: ["courseMaterials", course_id],
        queryFn: async () => {
            const res = await axiosSecure.get(`courseMaterials/getMaterialByCourseId/${course_id}`);

            return res.data.data;
        }
    })

    if (isPending) return <LoadingSpinner />



    // create course material
    const handleMaterialSubmit = async (data) => {
        const title = data.ClassMaterialTitle;
        const description = data.ClassMaterialDescription;
        const created_by = user._id;
        const materialType = data.fileType;

        console.log(materialType);


        // upload file to cloudinary
        if (materialType === "file") {
            const file = data.file[0]; // get the pdf file

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", myUploadPreset);
            formData.append("folder", "course_and_class_materials");

            try {
                setFormSubmissionLoading(true);
                const cloudinaryRes = await axios.post(`https://api.cloudinary.com/v1_1/${myCloudName}/raw/upload`, formData);


                // create course material
                if (cloudinaryRes.status === 200) {
                    const cloudinaryUrl = cloudinaryRes.data.secure_url;

                    const courseMaterialData = {
                        title, description, material_url: cloudinaryUrl, course_id, created_by
                    }

                    const res = await axiosSecure.post("/courseMaterials", courseMaterialData);

                    if (res.data.success) {
                        toast.success(res.data.message, {
                            duration: 2500,
                            position: "top-center"
                        })
                        setFormSubmissionLoading(false);
                        reset();
                        setShowMaterialForm(false);
                    }
                }
            } catch (error) {
                handleError(error, "Failed to create Course Material.");
                setFormSubmissionLoading(false);
                setShowMaterialForm(false);
                toast.error("Failed to create Course Material.", {
                    duration: 2500,
                    position: "top-center"
                });

            }
        }


        // create course material with url
        if (materialType === "url") {
            try {
                setFormSubmissionLoading(true);
                const courseMaterialData = {
                    title, description, material_url: data.url, course_id, created_by
                }

                const res = await axiosSecure.post("/courseMaterials", courseMaterialData);

                if (res.data.success) {
                    toast.success(res.data.message, {
                        duration: 2500,
                        position: "top-center"
                    })
                    setFormSubmissionLoading(false);
                    reset();
                    setShowMaterialForm(false);
                }
            } catch (error) {
                handleError(error, "Failed to create Course Material.");
                setFormSubmissionLoading(false);
                setShowMaterialForm(false);
                toast.error("Failed to create Course Material.", {
                    duration: 2500,
                    position: "top-center"
                });

            }
        }

        refetch();
    }



    // delete course material
    const handleCourseMaterialDelete = async (id, url, material_title) => {

        const swalResponse = await Swal.fire({
            title: "Delete this Course Material?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            cancelButtonColor: "#16A34A",
            confirmButtonText: "Yes, delete it!",
        });

        if (swalResponse.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/courseMaterials/${id}`, {
                    data: { material_title, material_url: url }
                });

                if (res.data.success) {
                    refetch();
                    Swal.fire({
                        title: "Deleted!",
                        text: res.data.message,
                        icon: "success",
                        confirmButtonColor: "#16A34A",
                    });
                }
            } catch (error) {
                handleError(error, "Failed to delete Course Material.");
                toast.error("Failed to delete Course Material.", {
                    duration: 2500,
                    position: "top-center"
                });
            }
        }
    }


    // material edit button
    const handleCourseMaterialEdit = (id) => {
        setShowUpdateCourseMaterialsForm(true);

        const foundClass = courseMaterials.find(singleCourseMaterials => singleCourseMaterials._id === id);


        if (foundClass) {
            setOriginalCourseMaterialData(foundClass);

            setValue("updateCourseMaterialTitle", foundClass.title);
            setValue("updateCourseMaterialDescription", foundClass.description);
        }
    }


    // update course material
    const handleCourseMaterialUpdate = async (data) => {
        if (!originalCourseMaterialData) return;
        const id = originalCourseMaterialData._id;

        const updateCourseMaterialData = {};

        if (data.updateClassTitle !== updateCourseMaterialData.title) {
            updateCourseMaterialData.title = data.updateClassTitle;
        }
    }

    return (
        <div className="mb-20">
            <Toaster />
            <SectionHeading title="Course Materials" />


            {/* toggle form button */}
            <button
                onClick={() => setShowMaterialForm(!showMaterialForm)}
                className={`mb-4 ${showMaterialForm ? "bg-error" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold py-2 px-4 rounded inline-flex items-center`}
            >
                {
                    showMaterialForm ?
                        <>
                            <CgClose className="mr-2" /> Cancel</>
                        :
                        <>
                            <FiPlus className="mr-2" /> Add New Material</>
                }
            </button>



            {/* create new course material form */}
            {showMaterialForm && (
                <form onSubmit={handleSubmit(handleMaterialSubmit)} className="mb-6 p-4 rounded-lg">

                    {/* title */}
                    <div className="grid grid-cols-6 gap-2">
                        <div className="label">
                            <span className="label-text">Material Title: </span>
                        </div>

                        <div className="col-span-5">
                            <input
                                type="text"
                                placeholder="Material Title"

                                {...register("ClassMaterialTitle", { required: "Material Title is required" })}

                                className="input input-bordered mb-2 w-full rounded-lg "
                            />

                            {errors.ClassMaterialTitle && <p className="text-error font-medium text-sm mb-2">{errors.ClassMaterialTitle.message}</p>}
                        </div>
                    </div>


                    {/* description */}
                    <div className="grid grid-cols-6 gap-2">
                        <div className="label">
                            <span className="label-text">Description: </span>
                        </div>

                        <div className="col-span-5">
                            <input
                                type="text"
                                placeholder="Material Description"

                                {...register("ClassMaterialDescription", { required: "Material Description is required" })}

                                className="input input-bordered mb-2 w-full rounded-lg "
                            />

                            {errors.ClassMaterialDescription && <p className="text-error font-medium text-sm mb-2">{errors.ClassMaterialDescription.message}</p>}
                        </div>
                    </div>



                    {/* File Type */}
                    <div className="grid grid-cols-6 gap-2">
                        <div className="label">
                            <span className="label-text">Resource Type: </span>
                        </div>
                        <select
                            {...register("fileType")}
                            className="mb-2 w-full p-2 select-bordered select rounded col-span-5"
                        >
                            <option value="file">File Upload</option>
                            <option value="url">External URL</option>
                        </select>
                    </div>

                    {/* Conditional Input */}
                    {materialType === "file" ? (
                        <div>
                            <input
                                type="file"
                                {...register("file", { required: "File is required" })}
                                className="file-input file-input-bordered mb-2 w-full p-2 border rounded"
                            />
                            {errors.file && <p className="text-error font-medium text-sm mb-2">{errors.file.message}</p>}
                        </div>
                    ) : (
                        <div>
                            <input
                                type="url"
                                placeholder="External URL"
                                {...register("url", { required: "URL is required" })}
                                className="input input-bordered mb-2 w-full p-2 rounded"
                            />
                            {errors.url && <p className="text-error font-medium text-sm mb-2">{errors.url.message}</p>}
                        </div>
                    )}


                    {/* submit button */}
                    {
                        formSubmissionLoading ?
                            <button className="btn w-36 btn-disabled py-2 px-4 rounded">
                                <CgSpinnerTwoAlt className="animate-spin " />
                            </button>
                            :
                            <button type="submit" className="btn btn-success text-white font-bold py-2 px-4 rounded">
                                Upload Material
                            </button>
                    }

                </form>
            )}



            {/* update course material form */}

            <div>
                {/* toggle update schedule form */}
                {
                    showUpdateScheduleForm && <button
                        onClick={() => setShowUpdateScheduleForm(false)}
                        className="mb-4 btn btn-error text-white font-bold rounded-lg mt-5"
                    >
                        <CgClose className="mr-2" /> Cancel
                    </button>
                }


                {showUpdateScheduleForm && (
                    <form onSubmit={handleSubmit(handleScheduleUpdate)} className="mb-6 p-4 rounded-lg">

                        {/* class title */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="label">
                                <span className="label-text">Title: </span>
                            </div>

                            <input
                                type="text"
                                placeholder="Class Title"

                                {...register("updateClassTitle")}

                                className="input input-bordered mb-2 w-full rounded-lg col-span-5"
                            />

                            {errors.updateClassTitle && <p className="text-error font-medium text-sm mb-2">{errors.updateClassTitle.message}</p>}
                        </div>


                        {/* class description */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="label">
                                <span className="label-text">Description: </span>
                            </div>

                            <textarea
                                placeholder="Class Description"

                                {...register("updateClassDescription")}

                                className="textarea textarea-bordered mb-2 w-full  rounded-lg col-span-5"
                            />
                            {errors.updateClassDescription && <p className="text-error font-medium text-sm mb-2">{errors.updateClassDescription.message}</p>}
                        </div>


                        {/* class date */}
                        <div className="grid grid-cols-6 gap-2
                    ">
                            <div className="label">
                                <span className="label-text">Date: </span>
                            </div>

                            <input
                                type="date"

                                min={new Date().toISOString().slice(0, 10)}

                                {...register("updateClassScheduledDate")}

                                className="mb-2 w-full input input-bordered rounded-lg col-span-5"
                            />
                            {errors.updateClassScheduledDate && <p className="text-error font-medium text-sm mb-2">{errors.updateClassScheduledDate.message}</p>}
                        </div>


                        {/* class time */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="label">
                                <span className="label-text">Time: </span>
                            </div>

                            <input
                                type="time"

                                {...register("updateClassScheduledTime")}

                                className="mb-2 w-full input input-bordered rounded-lg col-span-5"
                            />
                            {errors.updateClassScheduledTime && <p className="text-error font-medium text-sm mb-2">{errors.updateClassScheduledTime.message}</p>}
                        </div>


                        <button type="submit" className={`btn ${formSubmissionLoading ? "btn-disabled" : "btn-success text-white font-bold"}  rounded`}>
                            {
                                formSubmissionLoading ? <CgSpinnerTwoAlt className="animate-spin" /> : "Update Schedule"
                            }
                        </button>
                    </form>
                )}
            </div>




            {/* Material List */}
            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}

            <div>
                {courseMaterials.length === 0 && <p className="text-center text-error text-lg font-medium">Course Materials are not added yet</p>}
            </div>


            {/* table */}
            {courseMaterials.length > 0 &&
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Uploader</th>
                                <th>Resource</th>
                                {
                                    user.user_role !== "student" &&
                                    <th>
                                        Action
                                    </th>
                                }
                            </tr>
                        </thead>

                        <tbody>
                            {
                                courseMaterials.map((material, index) =>
                                    <tr key={material._id}>
                                        <th>{index + 1}</th>

                                        <td>{material.title}</td>

                                        <td>{material.description}</td>

                                        <td>{material.created_by.first_name} {material.created_by.last_name}</td>

                                        <td>
                                            <a href={material.material_url}
                                                target="_blank" rel="noreferrer"
                                                className="btn btn-success text-white text-sm">
                                                Get Resource
                                            </a>
                                        </td>


                                        {
                                            user.user_role !== "student" &&
                                            <th>
                                                <button
                                                    onClick={() => {
                                                        handleCourseMaterialEdit(material._id);

                                                        if (showMaterialForm) {
                                                            setShowMaterialForm(false);
                                                        }
                                                    }}
                                                    className="text-blue-500 hover:text-blue-600 mr-2"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button onClick={() => handleCourseMaterialDelete(material._id, material.material_url, material.title)} className="text-red-500 hover:text-red-600">
                                                    <FiTrash2 />
                                                </button>
                                            </th>
                                        }
                                    </tr>

                                )}
                        </tbody>
                    </table>
                </div>
            }

        </div>
    );
};

CourseMaterialFormAndList.propTypes = {
    course_id: PropTypes.string
}

export default CourseMaterialFormAndList;