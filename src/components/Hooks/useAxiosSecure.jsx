import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";


const axiosSecure = axios.create({
    baseURL: "http://localhost:5000"
})


const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { setLoading, logout } = useAuth();

    // REQUEST(request) INTERCEPTOR(interceptors) to add AUTHORIZATION(authorization) HEADER(headers) for every secure call USING(use) function
    axiosSecure.interceptors.request.use((config) => {
        // get token from local storage
        const token = localStorage.getItem("access-token");
        // add "Bearer " in front of the token header
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, (error) => {
        return Promise.reject(error)
    })



    // after intercepting generate a response or what to do next
    axiosSecure.interceptors.response.use((response) => {
        // if the status code within the range of 2xx
        return response;
    }, async (error) => {
        // if status code falls outside of range 2xx
        const status = error.response.status;
        if (status === 401 || status === 403) {
            await logout();
            setLoading(false);
            navigate('/signin');
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;