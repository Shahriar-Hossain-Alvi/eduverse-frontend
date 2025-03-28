import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GiCharacter } from "react-icons/gi";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";
import Select from 'react-select'
import toast, { Toaster } from "react-hot-toast";
import PropTypes from 'prop-types';
import { MdClose } from "react-icons/md";
import { isEqual } from "lodash";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import Swal from "sweetalert2";
import TanstackQueryErrorMessage from "../../../Utilities/TanstackQueryErrorMessage";


const AssignFaculty = ({ assigned_faculty, courseId, setShowFacultyAssignmentForm, refetch }) => {


    const axiosSecure = useAxiosSecure();
    const [facultyAssignLoading, setFacultyAssignLoading] = useState(false);
    const { formState: { errors }, setValue } = useForm({
        defaultValues: {
            assign_faculty: [],
        }
    });

    // Initialize selected faculties state using the prop data (if available)
    const initialSelectedFaculties = assigned_faculty
        ? assigned_faculty.map((faculty) => ({
            value: faculty._id,
            label: `${faculty.first_name} ${faculty.last_name} - ${faculty.email}`
        }))
        : [];

    const [selectedFaculties, setSelectedFaculties] = useState(initialSelectedFaculties);



    // get faculty names for assigning
    const { data: assignFacultyData = [], isPending, isError, error } = useQuery({
        queryKey: ["assignFacultyData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users/allFacultyNames")

            return res.data.data;
        }
    });


    // Transform faculty data to `react-select` format
    const facultyOptions = assignFacultyData?.map(faculty => ({
        value: faculty._id,
        label: `${faculty.first_name} ${faculty.last_name} - ${faculty.email}`
    }));



    // Handle selection change from react-select
    const handleSelectedFaculty = (selectedOptions) => {
        // react-select in multi mode returns the entire selected array. We merge the new selection with any previously selected faculty. (If the user uses the remove button on the chips, react-select's value will update accordingly.)
        setSelectedFaculties(selectedOptions || []);

        // Update the react-hook-form value (an array of IDs)
        setValue("assign_faculty", (selectedOptions || []).map(option => option.value));
    };


    // Remove a faculty from the list
    const handleRemoveFaculty = (facultyId) => {
        const updated = selectedFaculties.filter(option => option.value !== facultyId);

        setSelectedFaculties(updated);
        setValue("assign_faculty", updated.map(option => option.value));
    };



    // update assigned faculty 
    const updateAssignedFaculty = async () => {
        // if no change in the selected faculties
        if (isEqual(initialSelectedFaculties, selectedFaculties)) {
            return toast.error("No change in the selected faculties");
        }


        // if no faculty is selected
        if (selectedFaculties.length === 0) {
            return Swal.fire({
                title: "No Faculty Selected!",
                text: "Do you want to continue without assigning any faculty? This will remove all the currently assigned faculties from the course.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#FF0000",
                cancelButtonColor: "#16A34A",
                confirmButtonText: "Yes, remove all faculty!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setFacultyAssignLoading(true);
                        const assigned_faculty = selectedFaculties.map(faculty => faculty.value);

                        // add assigned faculty array to the courses collection
                        const res = await axiosSecure.patch(`/courses/${courseId}`, { assigned_faculty });

                        if (res.data.success === true) {
                            // send a post request to update the courseFacultyAssignment collection
                            const res = await axiosSecure.post(`/courseFacultyAssignments`, { course_id: courseId, users_id: assigned_faculty });

                            if (res.data.success === true) {
                                toast.success("Faculty assigned successfully");
                                setFacultyAssignLoading(false);
                                refetch();
                                setShowFacultyAssignmentForm(false);
                            }
                        }

                    } catch (error) {
                        console.log(error);
                        setFacultyAssignLoading(false);
                        const errorMessage = error.response?.data?.message || "Something went wrong.";
                        toast.error(errorMessage, { duration: 3000, position: "top-center" });
                        return;
                    }
                }
            });
        }


        // if faculty is selected
        try {
            setFacultyAssignLoading(true);
            const assigned_faculty = selectedFaculties.map(faculty => faculty.value);


            // add assigned faculty array to the courses collection
            const res = await axiosSecure.patch(`/courses/${courseId}`, { assigned_faculty });

            if (res.data.success === true) {
                // send a post request to update the courseFacultyAssignment
                const res = await axiosSecure.post(`/courseFacultyAssignments`, { course_id: courseId, users_id: assigned_faculty });

                if (res.data.success === true) {
                    toast.success("Faculty assigned successfully");
                    setFacultyAssignLoading(false);
                    refetch();
                    setShowFacultyAssignmentForm(false);
                }
            }

        } catch (error) {
            console.log(error);
            setFacultyAssignLoading(false);
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            toast.error(errorMessage, { duration: 3000, position: "top-center" });
            return;
        }
    }


    if (isPending) return <LoadingSpinner />


    return (
        <div>
            <Toaster />

            {isError && <TanstackQueryErrorMessage errorMessage={error.message} />}


            {/* show currently assigned faculty */}
            <div>
                <h2 className="text-xl font-semibold mb-2"> Currently Assigned Faculty</h2>

                <div className="flex flex-wrap gap-2">
                    {selectedFaculties?.length === 0 && <span className="badge badge-error text-white">No faculty assigned</span>}


                    {selectedFaculties.map((faculty) => (
                        <div key={faculty.value} className="flex items-center gap-1 bg-transparent border px-2 py-2 rounded">
                            <span>{faculty.label}</span>
                            <button
                                onClick={() => handleRemoveFaculty(faculty.value)}
                                className="btn btn-sm btn-error text-white"
                            >
                                <MdClose />
                            </button>
                        </div>
                    ))}
                </div>
            </div>



            {/* Faculty Selection Dropdown */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <label className="text-sm font-medium text-gray-500 flex items-center">
                    <GiCharacter className="mr-2" /> Assign a Faculty
                </label>
                <div className="col-span-2">
                    <Select
                        isMulti
                        options={facultyOptions}
                        value={selectedFaculties}
                        onChange={handleSelectedFaculty}
                        closeMenuOnSelect={false}
                        placeholder="Select Faculty..."
                        className="basic-multi-select mt-1 w-full col-span-2 text-black"
                        classNamePrefix="select"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                neutral80: "black", // selected text color
                                neutral60: "red",   // cross and dropdown button color
                            },
                        })}
                    />
                    {errors.assign_faculty && (
                        <p className="text-error text-sm pl-3 pt-1 animate-pulse">
                            {errors.assign_faculty.message}
                        </p>
                    )}
                </div>
                {
                    facultyAssignLoading ?
                        <button className="btn btn-disabled border-none w-full mb-2 "><CgSpinnerTwoAlt className="animate-spin" /></button>
                        :
                        <button onClick={updateAssignedFaculty} type="submit" className="btn btn-success text-white mt-4">
                            Update Assigned Faculty
                        </button>
                }

            </div>
        </div>
    );
};

AssignFaculty.propTypes = {
    assigned_faculty: PropTypes.array,
    courseId: PropTypes.string,
    setShowFacultyAssignmentForm: PropTypes.func,
    refetch: PropTypes.func
}

export default AssignFaculty;