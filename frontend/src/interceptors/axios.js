import { logoutUser } from "@/redux/authSlice";
import store from "@/redux/store";
import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.0.9:3000/api";
axios.defaults.withCredentials = true;

let refresh = false;
const { dispatch } = store;

const handleLogout = async () => {
  await dispatch(logoutUser());
};

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and token is not already being refreshed
    if (error.response) {
      if (error.response.status === 401 && !refresh) {
        // Log the status code and data
        refresh = true;

        try {
          const response = await axios.post(
            "refresh",
            {},
            { withCredentials: true }
          );

          if (response.status === 200) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.token}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          refresh = false;
          await handleLogout();
        }
      }
    } else {
      // Handle network errors
      console.error("Network error:", error.message);
    }

    // Reset refresh state for other errors
    refresh = false;

    return Promise.reject(error);
  }
);
