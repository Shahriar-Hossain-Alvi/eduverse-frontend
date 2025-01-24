import { Outlet } from "react-router";
import Navbar from "../Shared/CommonShared/Navbar";
import Footer from "../Shared/CommonShared/Footer";


const Main = () => {

    return (
        <div className="font-inter">
            <Navbar />
            <div className="container mx-auto">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;