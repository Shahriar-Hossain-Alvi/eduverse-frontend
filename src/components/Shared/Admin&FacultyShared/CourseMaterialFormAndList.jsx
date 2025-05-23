import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import SectionHeading from "../../Utilities/SectionHeading";
import { CgClose } from "react-icons/cg";
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
import { handleError } from "../../Utilities/handleError";


// handle is_active field for admin

const CourseMaterialFormAndList = ({ course_id, isCourseAssignmentActive }) => {
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
        },
        enabled: !!course_id
    })

    if (isPending) return <LoadingSpinner />



    // create course material
    const handleMaterialSubmit = async (data) => {
        const title = data.ClassMaterialTitle;
        const description = data.ClassMaterialDescription;
        const created_by = user._id;
        const materialType = data.fileType;



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
            }
        }
    }


    // material edit button
    const handleCourseMaterialEdit = (id) => {
        setShowUpdateCourseMaterialsForm(true);

        const foundCourseMaterial = courseMaterials.find(singleCourseMaterials => singleCourseMaterials._id === id);

        if (foundCourseMaterial) {
            setOriginalCourseMaterialData(foundCourseMaterial);

            setValue("updateCourseMaterialTitle", foundCourseMaterial.title);
            setValue("updateCourseMaterialDescription", foundCourseMaterial.description);
        }
    }


    // update course material
    const handleCourseMaterialUpdate = async (data) => {
        if (!originalCourseMaterialData) return;
        const id = originalCourseMaterialData._id;

        const updateCourseMaterialData = {};

        if (data.updateCourseMaterialTitle !== originalCourseMaterialData.title) {
            updateCourseMaterialData.title = data.updateCourseMaterialTitle;
        }

        if (data.updateCourseMaterialDescription !== originalCourseMaterialData.description) {
            updateCourseMaterialData.description = data.updateCourseMaterialDescription;
        }

        if (user._id !== originalCourseMaterialData.created_by._id) {
            updateCourseMaterialData.created_by = user._id;
        }

        // upload file to cloudinary
        if (materialType === "file" && data.file[0] !== undefined) {
            const file = data.file[0]; // get the file

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

                    updateCourseMaterialData.material_url = cloudinaryUrl;

                    setFormSubmissionLoading(false);

                    toast.success("Resource uploaded successfully", {
                        duration: 2500,
                        position: "top-center"
                    });
                }
            } catch (error) {
                handleError(error, "Failed to update Course Material.");
                setFormSubmissionLoading(false);
                toast.error("Failed to upload resource", {
                    duration: 2500,
                    position: "top-center"
                });

            }
        }

        if (materialType === "url") {
            updateCourseMaterialData.material_url = data.url;
        }

        if (Object.keys(updateCourseMaterialData).length === 0) {
            toast.error("No changes detected", {
                duration: 2500,
                position: "top-center"
            });
            return;
        }

        try {
            setFormSubmissionLoading(true);
            const res = await axiosSecure.patch(`/courseMaterials/${id}`, updateCourseMaterialData);

            if (res.data.success) {
                toast.success(res.data.message, {
                    duration: 2500,
                    position: "top-center"
                });
                setShowUpdateCourseMaterialsForm(false);
                refetch();
                reset();
                setFormSubmissionLoading(false);
            }

        } catch (error) {
            handleError(error, "Failed to update Course Material.");
            setFormSubmissionLoading(false);
        }
    }


    return (
        <div>
            <div className="mb-20">
                <Toaster />
                <SectionHeading title="Course Materials" />


                {/* toggle form button */}
                <button
                    disabled={!isCourseAssignmentActive}
                    onClick={() => setShowMaterialForm(!showMaterialForm)}
                    className={`mb-4 ${showMaterialForm ? "bg-error" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold py-2 px-4 inline-flex items-center rounded-lg btn`}
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
                    <div>
                        <SectionHeading title="Add New Course Material" />

                        <form onSubmit={handleSubmit(handleMaterialSubmit)} className="mb-6 p-4 rounded-lg">

                            {/* title */}
                            <div className="md:grid md:grid-cols-6 md:gap-2">
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
                            <div className="md:grid md:grid-cols-6 md:gap-2">
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
                            <div className="md:grid md:grid-cols-6 md:gap-2">
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
                    </div>
                )}



                {/* update course material form */}
                <div>
                    {/* toggle update schedule form */}
                    {
                        showUpdateCourseMaterialsForm && <button
                            onClick={() => setShowUpdateCourseMaterialsForm(false)}
                            className="mb-4 btn btn-error text-white font-bold rounded-lg mt-5"
                        >
                            <CgClose className="mr-2" /> Cancel
                        </button>
                    }


                    {showUpdateCourseMaterialsForm && (
                        <div>
                            <SectionHeading title="Update Course Material" />

                            <form onSubmit={handleSubmit(handleCourseMaterialUpdate)} className="mb-6 p-4 rounded-lg">

                                {/* Course material title */}
                                <div className="md:grid md:grid-cols-6 md:gap-2">
                                    <div className="label">
                                        <span className="label-text">Title: </span>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Course Material Title"

                                        {...register("updateCourseMaterialTitle")}

                                        className="input input-bordered mb-2 w-full rounded-lg col-span-5"
                                    />

                                    {errors.updateCourseMaterialTitle && <p className="text-error font-medium text-sm mb-2">{errors.updateCourseMaterialTitle.message}</p>}
                                </div>


                                {/* course material description */}
                                <div className="md:grid md:grid-cols-6 md:gap-2">
                                    <div className="label">
                                        <span className="label-text">Description: </span>
                                    </div>

                                    <textarea
                                        placeholder="Class Description"

                                        {...register("updateCourseMaterialDescription")}

                                        className="textarea textarea-bordered mb-2 w-full  rounded-lg col-span-5"
                                    />
                                    {errors.updateCourseMaterialDescription && <p className="text-error font-medium text-sm mb-2">{errors.updateCourseMaterialDescription.message}</p>}
                                </div>


                                {/* File Type */}
                                <div className="md:grid md:grid-cols-6 md:gap-2">
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
                                            {...register("file")}
                                            className="file-input file-input-bordered mb-2 w-full p-2 border rounded"
                                        />
                                        {errors.file && <p className="text-error font-medium text-sm mb-2">{errors.file.message}</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="url"
                                            placeholder="External URL"
                                            {...register("url")}
                                            className="input input-bordered mb-2 w-full p-2 rounded"
                                        />
                                        {errors.url && <p className="text-error font-medium text-sm mb-2">{errors.url.message}</p>}
                                    </div>
                                )}



                                <button type="submit" className={`btn ${formSubmissionLoading ? "btn-disabled" : "btn-success text-white font-bold"}  rounded`}>
                                    {
                                        formSubmissionLoading ? <CgSpinnerTwoAlt className="animate-spin" /> : "Update Material"
                                    }
                                </button>
                            </form>
                        </div>
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
                        <table className="table table-xs md:table-md">
                            {/* head */}
                            <thead>
                                <tr>
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
                                    courseMaterials.map((material) =>
                                        <tr className="hover" key={material._id}>

                                            <td>{material.title}</td>

                                            <td>{material.description}</td>

                                            <td>{material.created_by.first_name} {material.created_by.last_name}</td>

                                            <td>
                                                <a href={material.material_url}
                                                    target="_blank" rel="noreferrer"
                                                    className="btn btn-sm md:btn-md btn-success text-white text-xs md:text-base">
                                                    View
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
        </div>
    );
};

CourseMaterialFormAndList.propTypes = {
    course_id: PropTypes.string,
    isCourseAssignmentActive: PropTypes.bool,
}

export default CourseMaterialFormAndList;