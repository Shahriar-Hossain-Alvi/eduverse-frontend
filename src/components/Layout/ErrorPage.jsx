
import { Link } from "react-router";
import ErrorAnimation from "../../assets/animation/errorAnimation.json"
import Lottie from "react-lottie";


const ErrorPage = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: ErrorAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
            />

            <p className="text-error text-3xl font-bold uppercase">Error 404!</p>
            <Link to="/" className="btn btn-success mt-3 text-white">Back to Home</Link>
        </div>
    );
};

export default ErrorPage;