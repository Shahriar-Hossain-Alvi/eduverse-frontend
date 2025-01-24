import { useParams } from "react-router";

const CourseDetails = () => {

    const { id } = useParams();
    console.log(id);

    return (
        <div>

        </div>
    );
};

export default CourseDetails;