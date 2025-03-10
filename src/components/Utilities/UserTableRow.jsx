import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { MdContentCopy } from "react-icons/md";
import Swal from 'sweetalert2';


const UserTableRow = ({ singleUser, serialNo }) => {

    const { _id, user_role, user_name, email, is_active } = singleUser;


    const handleCopyButton = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                Swal.fire({
                    title: 'Copied!',
                    text: `${text} has been copied to clipboard.`,
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                    position: 'top-right',
                    width: 300,
                })
            })
            .catch(err => {
                Swal.fire({
                    title: 'Failed to Copy!',
                    icon: 'error',
                    timer: 1000,
                    showConfirmButton: false,
                    position: 'top-right'
                })
                console.error("Failed to copy: ", err);
            });
    }


    return (
        <tr className='hover'>
            <td>{serialNo + 1}</td>
            <td>{user_role}</td>
            <td className='relative'>
                {email}
                <p className='tooltip absolute top-0 right-0' data-tip="copy email">
                    <button onClick={() => handleCopyButton(email)} className="btn btn-xs btn-ghost hover:bg-transparent">
                        <MdContentCopy /></button>
                </p>
            </td>

            <td>{user_name}</td>

            <td>{is_active ? <button className="badge badge-success badge-sm text-white">Active</button> : <button className="badge badge-error badge-sm text-white">Disabled</button>}</td>

            <td>
                {
                    user_role !== "admin" &&
                    < Link to={`/admin/users/${_id}`} className='btn btn-sm bg-indigo-700 hover:bg-indigo-600 text-white'>View</Link>
                }
            </td>
        </tr >
    );
};

UserTableRow.propTypes = {
    singleUser: PropTypes.object,
    serialNo: PropTypes.number
}


export default UserTableRow;