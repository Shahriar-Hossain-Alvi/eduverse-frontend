import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";


const AssignFaculty = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


    const { register, reset, formState: { errors }, handleSubmit, setValue } = useForm({
        defaultValues: {
            assign_faculty: [],
        }
    });

    const [selectedFaculties, setSelectedFaculties] = useState([]);


    const { data: facultyAndPrerequisiteData = [], isPending, isError, error } = useQuery({
        queryKey: ["facultyAndPrerequisiteData"],
        queryFn: async () => {
            const res = await Promise.all([
                axiosSecure.get("/users/allFacultyNames")
            ])
            return res;
        }
    });

    const facultyNamesRes = facultyAndPrerequisiteData[0]?.data;


    // Transform faculty data to `react-select` format
    const facultyOptions = facultyNamesRes?.data?.map(faculty => ({
        value: faculty._id,
        label: `${faculty.first_name} ${faculty.last_name} - ${faculty.email}`
    }));

    // Handle faculty selection change
    const handleSelectedFaculty = (selectedOptions) => {
        setSelectedFaculties(selectedOptions);
        setValue("assign_faculty", selectedOptions.map(option => option.value));
    };





    if (isPending) return <LoadingSpinner />


    return (
        <div>
            
        </div>
    );
};

export default AssignFaculty;