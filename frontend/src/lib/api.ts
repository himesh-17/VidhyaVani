import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get("accessToken");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get("refreshToken");
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                    // Update cookies
                    Cookies.set("accessToken", accessToken, { expires: 1 / 96 }); // 15 minutes
                    Cookies.set("refreshToken", newRefreshToken, { expires: 7 });

                    // Retry original request
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");

                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        api.post("/auth/login", { email, password }),

    register: (data: { name: string; email: string; password: string; role?: string }) =>
        api.post("/auth/register", data),

    logout: () => api.post("/auth/logout"),

    getMe: () => api.get("/auth/me"),

    refresh: (refreshToken: string) =>
        api.post("/auth/refresh", { refreshToken }),
};

// Blog API
export const blogApi = {
    getPublicBlogs: (page = 1, limit = 10) =>
        api.get(`/blogs?page=${page}&limit=${limit}`),

    getBlogBySlug: (slug: string) =>
        api.get(`/blogs/${slug}`),

    getMyBlogs: (status?: string) =>
        api.get(`/blogs/user/my-blogs${status ? `?status=${status}` : ""}`),

    getBlogById: (id: string) =>
        api.get(`/blogs/edit/${id}`),

    createBlog: (data: Record<string, unknown>) =>
        api.post("/blogs", data),

    updateBlog: (id: string, data: Record<string, unknown>) =>
        api.put(`/blogs/${id}`, data),

    deleteBlog: (id: string) =>
        api.delete(`/blogs/${id}`),

    submitForReview: (id: string) =>
        api.post(`/blogs/${id}/submit`),
};

// Review API
export const reviewApi = {
    getPendingBlogs: () =>
        api.get("/reviews/pending"),

    approveBlog: (blogId: string) =>
        api.post(`/reviews/${blogId}/approve`),

    rejectBlog: (blogId: string, reason: string) =>
        api.post(`/reviews/${blogId}/reject`, { reason }),

    getReviewHistory: (blogId: string) =>
        api.get(`/reviews/${blogId}/history`),
};

// Event API
export const eventApi = {
    getEvents: (filter?: "upcoming" | "past") =>
        api.get(`/events${filter ? `?filter=${filter}` : ""}`),

    getEvent: (id: string) =>
        api.get(`/events/${id}`),

    createEvent: (data: Record<string, unknown>) =>
        api.post("/events", data),

    updateEvent: (id: string, data: Record<string, unknown>) =>
        api.put(`/events/${id}`, data),

    deleteEvent: (id: string) =>
        api.delete(`/events/${id}`),
};

// User/Admin API
export const userApi = {
    updateProfile: (data: { name?: string; avatar?: string }) =>
        api.put("/users/profile", data),

    getAllUsers: (params?: { role?: string; search?: string }) =>
        api.get("/users", { params }),

    getUser: (id: string) =>
        api.get(`/users/${id}`),

    changeRole: (id: string, role: string) =>
        api.put(`/users/${id}/role`, { role }),

    deleteUser: (id: string) =>
        api.delete(`/users/${id}`),

    getAllBlogs: (params?: { status?: string; author?: string }) =>
        api.get("/users/blogs", { params }),

    overrideBlogStatus: (blogId: string, status: string) =>
        api.put(`/users/blogs/${blogId}/status`, { status }),

    getDashboardStats: () =>
        api.get("/users/stats"),
};

export const uploadApi = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        return api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
