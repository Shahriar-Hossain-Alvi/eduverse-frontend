import PropTypes from 'prop-types';
import { FaCalendarAlt, FaChalkboardTeacher, FaClock, FaTag } from 'react-icons/fa';
import { LuBookOpenCheck } from 'react-icons/lu';
import useAuth from '../../../Hooks/useAuth';
import { Link } from 'react-router';

const CourseCard = ({ singleCourseDetails }) => {

    const { user } = useAuth();
    console.log(user.user_role);

    const { _id, title, description, cover_url, assigned_faculty, credits, end_date, prerequisites, start_date, total_available_seats
    } = singleCourseDetails;

    console.log(singleCourseDetails);

    return (
        <div className={`card ${user.user_role === "admin" && "bg-indigo-700"} ${user.user_role === "student" && "bg-blue-700"} ${user.user_role === "faculty" && "bg-green-700"} shadow-xl overflow-hidden p-2`}>
            {/* Cover Image */}
            {cover_url && (
                <figure className="w-full h-56 overflow-hidden">
                    <img
                        src={cover_url}
                        alt={title}
                        className="w-full h-full  object-fill"
                    />
                </figure>
            )}

            <div className="card-body">
                {/* Course Title */}
                <h2 className="card-title text-white text-xl font-bold">{title}</h2>

                {/* Description */}
                <p className="text-sm line-clamp-3 text-white">{description}</p>

                {/* Course Details */}
                <div className="space-y-2 mt-4 text-white">
                    {/* Credits */}
                    <div className="flex items-center space-x-2">
                        <FaTag className="w-4 h-4 text-success" />
                        <span>Credits: {credits}</span>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="w-4 h-4 text-success" />
                        <span>
                            Duration: {new Date(start_date).toLocaleDateString()} -
                            {new Date(end_date).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Available Seats */}
                    <div className="flex items-center space-x-2">
                        <FaClock className="w-4 h-4 text-success" />
                        <span>Available Seats: {total_available_seats}</span>
                    </div>

                    {/* Assigned Faculty */}
                    <div className="flex items-center space-x-2">
                        <FaChalkboardTeacher className="w-4 h-4 text-success" />
                        <span>
                            Assigned Faculty: {
                                assigned_faculty.length > 0 ? assigned_faculty.length : "Not Assigned Yet"
                            }
                        </span>
                    </div>


                    {/* Prerequisites */}
                    <div className="flex items-center space-x-2">
                        <LuBookOpenCheck className="w-4 h-4 text-success" />
                        <span>
                            Prerequisites: {
                                prerequisites.length > 0 ?
                                    prerequisites.length : "Not Needed"
                            }
                        </span>
                    </div>

                    <Link to={`/admin/courses/${_id}`} className="btn btn-success text-white">View Details</Link>
                </div>
            </div>
        </div>
    );
};


CourseCard.propTypes = {
    singleCourseDetails: PropTypes.object
}

export default CourseCard;