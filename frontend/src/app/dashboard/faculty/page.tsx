"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { reviewApi, eventApi } from "@/lib/api";
import { Blog, Event } from "@/types";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";
import { NoPendingReviews, NoEvents } from "@/components/shared/EmptyState";
import {
    ClipboardCheck,
    Calendar,
    CheckCircle,
    XCircle,
    Eye,
    Plus,
    Clock,
    MapPin,
    Trash2,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

export default function FacultyDashboard() {
    const { user } = useAuth();
    const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [rejectingBlog, setRejectingBlog] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchPendingBlogs();
        fetchEvents();
    }, []);

    const fetchPendingBlogs = async () => {
        try {
            setIsLoadingBlogs(true);
            const response = await reviewApi.getPendingBlogs();
            setPendingBlogs(response.data.data.blogs);
        } catch (error) {
            console.error("Failed to fetch pending blogs:", error);
        } finally {
            setIsLoadingBlogs(false);
        }
    };

    const fetchEvents = async () => {
        try {
            setIsLoadingEvents(true);
            const response = await eventApi.getEvents();
            setEvents(response.data.data.events);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const handleApprove = async (blogId: string) => {
        try {
            await reviewApi.approveBlog(blogId);
            fetchPendingBlogs();
        } catch (error) {
            console.error("Failed to approve:", error);
        }
    };

    const handleReject = async (blogId: string) => {
        if (!rejectReason.trim()) return;
        try {
            await reviewApi.rejectBlog(blogId, rejectReason);
            setRejectingBlog(null);
            setRejectReason("");
            fetchPendingBlogs();
        } catch (error) {
            console.error("Failed to reject:", error);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await eventApi.deleteEvent(eventId);
            fetchEvents();
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    <span>Faculty Portal</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif mb-2 tracking-tight">
                    Faculty Dashboard
                </h1>
                <p className="text-slate-600 text-lg">Review submissions and manage academic events</p>
            </motion.div>

            {/* Stats */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-amber-100 font-medium mb-1">Pending Reviews</p>
                            <div className="text-4xl font-bold font-serif">{pendingBlogs.length}</div>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <ClipboardCheck className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-indigo-100 font-medium mb-1">Total Events</p>
                            <div className="text-4xl font-bold font-serif">{events.length}</div>
                        </div>
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Pending Reviews Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">Pending Reviews</h2>
                    <Link
                        href="/dashboard/faculty/review"
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2"
                    >
                        View all submissions
                    </Link>
                </div>

                {isLoadingBlogs ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : pendingBlogs.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                        <NoPendingReviews />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {pendingBlogs.slice(0, 5).map((blog) => (
                                <motion.div
                                    key={blog._id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                                                    Pending Review
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">
                                                {blog.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-3">{blog.excerpt}</p>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-bold">
                                                        {blog.author?.name?.charAt(0)}
                                                    </div>
                                                    {blog.author?.name}
                                                </div>
                                                <span>•</span>
                                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/dashboard/faculty/review?blog=${blog._id}`}
                                                className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                                            >
                                                Review Content
                                                <ArrowRight className="ml-1.5 h-4 w-4" />
                                            </Link>
                                            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
                                            <button
                                                onClick={() => handleApprove(blog._id)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-colors"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setRejectingBlog(blog._id)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm shadow-red-200 transition-colors"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reject Modal */}
                                    {rejectingBlog === blog._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-6 p-6 bg-red-50 rounded-xl border border-red-100"
                                        >
                                            <label className="block text-sm font-bold text-red-800 mb-2">
                                                Reason for Rejection
                                            </label>
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Provide constructive feedback for the student..."
                                                className="w-full p-3 rounded-xl border border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none resize-none bg-white text-sm"
                                                rows={3}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handleReject(blog._id)}
                                                    disabled={!rejectReason.trim()}
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-200"
                                                >
                                                    Confirm Rejection
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRejectingBlog(null);
                                                        setRejectReason("");
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>

            {/* Events Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">Upcoming Events</h2>
                    <Link
                        href="/events/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Create Event
                    </Link>
                </div>

                {isLoadingEvents ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                        <NoEvents onAction={() => window.location.href = "/events/create"} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.slice(0, 6).map((event) => (
                            <motion.div
                                key={event._id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event._id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif line-clamp-2">
                                    {event.title}
                                </h3>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                        <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                                        {new Date(event.eventDate).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                        {event.venue}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
