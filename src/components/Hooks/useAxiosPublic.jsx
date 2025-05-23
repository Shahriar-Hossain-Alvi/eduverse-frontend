import axios from "axios";


const axiosPublic = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "https://eduverse-tc-web-wizards-backend.vercel.app/api",
})

axiosPublic.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;