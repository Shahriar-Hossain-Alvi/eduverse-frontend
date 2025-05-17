import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../Shared/CommonShared/Navbar";
import Footer from "../Shared/CommonShared/Footer";


const Main = () => {

    return (
        <div className="font-geist">
            <ScrollRestoration />
            <Navbar />
            <div className="mx-auto w-full">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;