// User types
export type UserRole = "STUDENT" | "FACULTY" | "ADMIN";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

// Auth types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

// Blog types
export type BlogStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface BlogStyle {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    theme: "light" | "dark";
}

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    status: BlogStatus;
    author: User;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    theme: "light" | "dark";
    rejectionReason?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogData {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    theme?: "light" | "dark";
}

// Review types
export interface BlogReview {
    _id: string;
    blog: Blog;
    reviewer: User;
    action: "APPROVED" | "REJECTED";
    reason?: string;
    reviewedAt: string;
}

// Event types
export interface Event {
    _id: string;
    title: string;
    description?: string;
    venue: string;
    eventDate: string;
    coverImage?: string;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventData {
    title: string;
    description?: string;
    venue: string;
    eventDate: string;
    coverImage?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
