import { NavLink } from "react-router";


const Navbar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">LOGO</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><NavLink>Contacts</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;