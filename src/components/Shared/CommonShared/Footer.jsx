import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";


const Footer = () => {
    return (
        <footer className="footer bg-neutral text-neutral-content p-10 w-full">
            <aside>
                <p>LOGO</p>
                <p>
                    EduVerse
                    <br />
                    Student Management Web App
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4 text-xl">
                    <FaFacebookF />
                    <RiTwitterXFill />
                    <FaLinkedinIn />
                </div>
            </nav>
        </footer>
    );
};

export default Footer;