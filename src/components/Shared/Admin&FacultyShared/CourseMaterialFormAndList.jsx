import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLink, FiPlus, FiUpload } from "react-icons/fi";
import SectionHeading from "../../Utilities/SectionHeading";
import { CgClose } from "react-icons/cg";

const CourseMaterialFormAndList = () => {
    const [showMaterialForm, setShowMaterialForm] = useState(false); // show/hide material form
    const [materials, setMaterials] = useState([])

    // hook form
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    const materialType = watch("fileType", "file");


    const handleMaterialSubmit = (data) => {

        console.log(data);
    }


    return (
        <div>
            <SectionHeading title="Course Materials" />

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


                    <button type="submit" className="bg-success text-white font-bold py-2 px-4 rounded">
                        Upload Material
                    </button>
                </form>
            )}



            {/* Material List */}
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

export default CourseMaterialFormAndList;