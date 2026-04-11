import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth";

const instance = axios.create({
  baseURL: (`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api`),
});

// Request: Attach access token
instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: Handle 401 and try refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/refresh-token`), {
          refreshToken: getRefreshToken(),
        });
        if (res.data.success) {
          setTokens({
            accessToken: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
          });
          originalRequest.headers["Authorization"] = `Bearer ${res.data.data.accessToken}`;
          return instance(originalRequest);
        } else {
          clearTokens();
          window.location.href = "/login";
        }
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
