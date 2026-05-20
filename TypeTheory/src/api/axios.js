import axios from "axios";
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}/api`,
});
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
axiosClient.interceptors.response.use((response) => {
    return response;
},(error) => {
    const { response } = error;
    if (response && response.status === 401) {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
            localStorage.removeItem("ACCESS_TOKEN");
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register") {
                window.location.href = "/login";
            }
        }
    }
   return Promise.reject(error);
    
});
export { axiosClient as api };
export default axiosClient;