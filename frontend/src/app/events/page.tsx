"use client";

import React, { useEffect, useState } from "react";
import { eventApi } from "@/lib/api";
import { Event } from "@/types";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";
import { NoEvents } from "@/components/shared/EmptyState";
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
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

export default function EventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await eventApi.getEvents(filter !== "all" ? filter : undefined);
            setEvents(response.data.data.events);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        setIsDeleting(id);
        try {
            await eventApi.deleteEvent(id);
            setEvents(events.filter((e) => e._id !== id));
        } catch (error) {
            console.error("Failed to delete event:", error);
        } finally {
            setIsDeleting(null);
        }
    };

    const isUpcoming = (date: string) => new Date(date) > new Date();

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
                <div className="text-center md:text-left flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4"
                    >
                        <Calendar className="h-4 w-4" />
                        <span>University Life</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight font-serif"
                    >
                        Events & Workshops
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
                    >
                        Discover what's happening on campus. Join seminars, workshops, and cultural fests.
                    </motion.p>
                </div>
                {user && ["FACULTY", "ADMIN"].includes(user.role) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href={user.role === "ADMIN" ? "/dashboard/admin/events/create" : "/dashboard/faculty/events/create"}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105"
                        >
                            <Plus className="h-5 w-5" />
                            Create Event
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center md:justify-start gap-2 mb-12"
            >
                <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 inline-flex">
                    {(["all", "upcoming", "past"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative",
                                filter === f
                                    ? "bg-white text-indigo-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                        >
                            {filter === f && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-white rounded-xl shadow-sm z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 filter-label capitalize">
                                {f === "all" ? "All Events" : f === "upcoming" ? "Upcoming" : "Past Events"}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <NoEvents />
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {events.map((event) => (
                            <motion.div
                                layout
                                key={event._id}
                                variants={itemVariants}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-full"
                            >
                                <div className="group h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 flex flex-col">
                                    {event.coverImage ? (
                                        <div className="h-64 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 duration-500" />
                                            <img
                                                src={event.coverImage}
                                                alt={event.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 z-20">
                                                <span
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border border-white/20 uppercase tracking-wide",
                                                        isUpcoming(event.eventDate)
                                                            ? "bg-emerald-500/90 text-white"
                                                            : "bg-slate-500/90 text-white"
                                                    )}
                                                >
                                                    {isUpcoming(event.eventDate) ? "Upcoming" : "Past"}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative group-hover:bg-indigo-100 transition-colors">
                                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                            <Calendar className="h-16 w-16 text-indigo-200 group-hover:text-indigo-300 transition-colors transform group-hover:scale-110 duration-500" />
                                        </div>
                                    )}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-indigo-600">

                                        </div>
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 font-serif leading-tight">
                                                {event.title}
                                            </h2>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                    <Clock className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">
                                                    {new Date(event.eventDate).toLocaleString("en-US", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{event.venue}</span>
                                            </div>
                                        </div>

                                        {event.description && (
                                            <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                                                {event.description}
                                            </p>
                                        )}

                                        {/* Actions for Faculty/Admin */}
                                        {user && (user.role === "ADMIN" || user._id === event.createdBy?._id) && (
                                            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100">
                                                <Link
                                                    href={user.role === "ADMIN"
                                                        ? `/dashboard/admin/events/edit/${event._id}`
                                                        : `/dashboard/faculty/events/edit/${event._id}`
                                                    }
                                                    className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    disabled={isDeleting === event._id}
                                                    className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                >
                                                    {isDeleting === event._id ? (
                                                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
