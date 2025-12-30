"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { blogApi } from "@/lib/api";
import { Blog } from "@/types";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";
import { NoBlogs } from "@/components/shared/EmptyState";
import {
    PenSquare,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Send,
    Sparkles,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
    DRAFT: { label: "Draft", color: "bg-slate-100 text-slate-700 border-slate-200", icon: FileText },
    PENDING_REVIEW: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    APPROVED: { label: "Approved", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
    REJECTED: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function StudentDashboard() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchBlogs();
    }, [filter]);

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await blogApi.getMyBlogs(filter !== "all" ? filter : undefined);
            setBlogs(response.data.data.blogs);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: blogs.length,
        drafts: blogs.filter((b) => b.status === "DRAFT").length,
        pending: blogs.filter((b) => b.status === "PENDING_REVIEW").length,
        approved: blogs.filter((b) => b.status === "APPROVED").length,
        rejected: blogs.filter((b) => b.status === "REJECTED").length,
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span>Student Dashboard</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif tracking-tight mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.name?.split(" ")[0]}</span>
                    </h1>
                    <p className="text-slate-600 text-lg">Manage your academic contributions and track their status</p>
                </div>
                <Link
                    href="/dashboard/student/blogs/create"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-indigo-200"
                >
                    <PenSquare className="h-5 w-5" />
                    Write New Blog
                </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
            >
                {[
                    { label: "Total Blogs", value: stats.total, color: "text-slate-900", icon: FileText },
                    { label: "Drafts", value: stats.drafts, color: "text-slate-600", icon: Edit },
                    { label: "Pending", value: stats.pending, color: "text-amber-600", icon: Clock },
                    { label: "Approved", value: stats.approved, color: "text-emerald-600", icon: CheckCircle },
                    { label: "Rejected", value: stats.rejected, color: "text-red-600", icon: XCircle },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`text-3xl font-bold ${stat.color} mb-1 font-serif`}>{stat.value}</div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                            <stat.icon className="h-3.5 w-3.5" />
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                <Filter className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
                {["all", "DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={cn(
                            "px-4 py-2 rounded-full text-base font-medium whitespace-nowrap transition-all",
                            filter === status
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        )}
                    >
                        {status === "all" ? "All Posts" : statusConfig[status as keyof typeof statusConfig]?.label}
                    </button>
                ))}
            </div>

            {/* Blog List */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : blogs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <NoBlogs onAction={() => window.location.href = "/dashboard/student/blogs/create"} />
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {blogs.map((blog) => {
                            const status = statusConfig[blog.status];
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    layout
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    key={blog._id}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                                >
                                    {blog.coverImage && (
                                        <div className="h-48 bg-slate-100 overflow-hidden relative">
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm",
                                                        status.color
                                                    )}
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        {!blog.coverImage && (
                                            <div className="mb-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                                                        status.color
                                                    )}
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {status.label}
                                                </span>
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 font-serif group-hover:text-indigo-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                                            {blog.excerpt}
                                        </p>

                                        {blog.status === "REJECTED" && blog.rejectionReason && (
                                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                                <p className="text-xs text-red-600 font-bold mb-1">Feedback from Reviewer:</p>
                                                <p className="text-xs text-red-700">{blog.rejectionReason}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                                            {blog.status === "APPROVED" && (
                                                <Link
                                                    href={`/blogs/${blog.slug}`}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Article
                                                </Link>
                                            )}
                                            {["DRAFT", "REJECTED"].includes(blog.status) && (
                                                <>
                                                    <Link
                                                        href={`/dashboard/student/blogs/create?edit=${blog._id}`}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await blogApi.submitForReview(blog._id);
                                                                fetchBlogs();
                                                            } catch (error) {
                                                                console.error("Failed to submit:", error);
                                                            }
                                                        }}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        Submit
                                                    </button>
                                                </>
                                            )}
                                            {blog.status === "PENDING_REVIEW" && (
                                                <span className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50 rounded-xl border border-amber-100">
                                                    <Clock className="h-4 w-4" />
                                                    Under Review
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
