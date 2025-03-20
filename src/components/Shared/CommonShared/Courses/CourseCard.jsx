import PropTypes from 'prop-types';
import { FaCalendarAlt, FaChalkboardTeacher, FaMedal } from 'react-icons/fa';
import { LuBookOpenCheck } from 'react-icons/lu';
import useAuth from '../../../Hooks/useAuth';
import { Link } from 'react-router';
import { MdOutlineAirlineSeatReclineNormal } from 'react-icons/md';
import { format } from "date-fns"

const CourseCard = ({ singleCourseDetails }) => {

    const { user } = useAuth();

    const { _id, title, description, cover_url, assigned_faculty, credits, end_date, prerequisites, start_date, total_available_seats} = singleCourseDetails;

    const current_date = new Date();


    // Role-based theme colors
    const themeColors = {
        admin: {
            bg: "bg-indigo-600",
            button: "bg-indigo-500 hover:bg-indigo-600 border hover:border",
        },
        faculty: {
            bg: "bg-green-600",
            button: "bg-green-500 hover:bg-green-600 border hover:border",
        },
        student: {
            bg: "bg-eduverse_student_primary_color",
            button: "bg-eduverse_student_primary_color_lite hover:bg-eduverse_student_primary_color border hover:border",
        },
    }

    const roleTheme = themeColors[user.user_role]

    return (
        <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className={`absolute inset-0 ${roleTheme.bg} opacity-90 transition-opacity group-hover:opacity-95`} />

            {/* Cover Image */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={cover_url}
                    alt={title}
                    className="h-full w-full object-fill transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            </div>


            <div className="relative space-y-4 p-6">
                {/* Title & Description */}
                <div className="space-y-2">
                    <h2 className="line-clamp-1 text-xl font-bold text-white">{title}</h2>
                    <p className="line-clamp-2 text-sm text-white/80">{description}</p>
                </div>

                {/* Course Details Grid */}
                <div className="grid grid-cols-2 gap-4">

                    {/* credits */}
                    <div className="flex items-center gap-2 text-white/90">
                        <FaMedal className="h-5 w-5" />
                        <span className="text-sm">
                            Credits : {credits}
                        </span>
                    </div>



                    {/* seat */}
                    <div className="flex items-center gap-2 text-white/90">
                        <MdOutlineAirlineSeatReclineNormal className="h-5 w-5" />
                        <span className="text-sm">
                            Available Seat : {total_available_seats}
                        </span>
                    </div>



                    {/* faculty */}
                    <div className="flex items-center gap-2 text-white/90">
                        <FaChalkboardTeacher className="h-5 w-5" />
                        <span className="text-sm">
                            Faculty : {
                                assigned_faculty.length > 0 ? assigned_faculty.length : "Not assigned yet"
                            }
                        </span>
                    </div>


                    {/* prerequisite */}
                    <div className="flex items-center gap-2 text-white/90">
                        <LuBookOpenCheck className="h-5 w-5" />
                        <span className="text-sm">
                            Prerequisite : {
                                prerequisites.length > 0 ? prerequisites.length : "None"
                            }
                        </span>
                    </div>
                </div>


                {/* Date Range */}
                <div className="flex items-center gap-2 text-white/90">
                    <FaCalendarAlt className="h-5 w-5" />
                    <span className="text-sm">
                        Duration: {format(new Date(start_date), "MMM d, yyyy")} - {format(new Date(end_date), "MMM d, yyyy")}
                    </span>
                </div>

                <div className='relative pt-5'>
                    {/* Action Button */}
                    <Link
                        to={`/${user.user_role}/courses/${_id}`}
                        className={`btn btn-block rounded-lg ${roleTheme.button} font-medium text-white`}
                    >
                        View Details
                    </Link>

                    {(new Date(start_date)) > current_date ?
                        <button className="badge badge-success rounded-full badge-lg text-white absolute top-2 right-0 animate-bounce">Enrollment Going on</button>
                        :
                        <button className="badge badge-error rounded-full badge-lg text-white  absolute top-2 right-0">Enrollment Closed</button>
                    }
                </div>
            </div>
        </div>
    );
};


CourseCard.propTypes = {
    singleCourseDetails: PropTypes.object
}

export default CourseCard;