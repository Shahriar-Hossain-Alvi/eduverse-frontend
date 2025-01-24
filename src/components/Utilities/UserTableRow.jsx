import PropTypes from 'prop-types';
import { Link } from 'react-router';

const UserTableRow = ({ singleUser, serialNo }) => {

    const { _id, user_role, user_name, email, is_active } = singleUser;

    return (
        <tr className='hover'>
            <th>{serialNo + 1}</th>
            <td>{user_role}</td>
            <td>{email}</td>
            <td>{user_name}</td>
            <td>{is_active ? <div className="badge badge-success badge-sm text-white">Active</div> : <div className="badge badge-error badge-sm text-white">Disabled</div>}</td>
            <td>
                {
                    user_role !== "admin" &&
                    < Link  to={`/admin/users/${_id}`} className='btn btn-sm bg-indigo-700 hover:bg-indigo-600 text-white'>View</Link>
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