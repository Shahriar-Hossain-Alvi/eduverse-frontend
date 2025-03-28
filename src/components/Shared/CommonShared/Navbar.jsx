import { useContext } from "react";
import { Link, NavLink } from "react-router";
import { ThemeContext } from "../../Provider/ThemeProvider";
import useAuth from "../../Hooks/useAuth";
import { FaSun, FaMoon } from "react-icons/fa";


const Navbar = () => {

    const { setTheme } = useContext(ThemeContext);
    const { user, logout } = useAuth();

    // Function to toggle between dark and light mode
    const changeTheme = (event) => {
        // If the checkbox is checked, set the theme to light, otherwise dark
        setTheme(event.target.checked ? "light" : "dark");
    };

    return (
        <div>
            <div className="hidden lg:flex md:justify-between navbar bg-base-100">
                <a className="btn btn-ghost text-xl">EduVerse</a>
                <div>
                    <label className="flex cursor-pointer gap-2 mr-2">
                        <span className="self-center">
                            <FaMoon />
                        </span>
                        <input onChange={changeTheme} type="checkbox" value="light" className="toggle theme-controller" />
                        <span className="self-center">
                            <FaSun />
                        </span>
                    </label>


                    <ul className="menu menu-horizontal px-1  items-center gap-2">
                        <li><NavLink to="/contact">Contact Us</NavLink></li>
                        {
                            user && <button onClick={logout} className="btn btn-error btn-xs text-white">Logout</button>
                        }
                    </ul>
                </div>
            </div>


            {/* navbar for small screen */}
            <div className="lg:hidden navbar flex-col">
                <div className="">
                    <Link to="/" className="btn btn-ghost text-xl">EduVerse</Link>
                </div>

                <div>
                    <label className="flex cursor-pointer gap-2 mr-2">
                        <span className="self-center">
                            <FaMoon />
                        </span>

                        <input onChange={changeTheme} type="checkbox" value="light" className="toggle theme-controller" />

                        <span className="self-center">
                            <FaSun />
                        </span>
                    </label>


                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1  items-center gap-2">
                            <li><NavLink to="/contact">Contact Us</NavLink></li>
                            {
                                user && <button onClick={logout} className="btn btn-error btn-sm text-white">Logout</button>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;