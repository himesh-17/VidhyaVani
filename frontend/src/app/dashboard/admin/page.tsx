"use client";

import React, { useEffect, useState } from "react";
import { userApi } from "@/lib/api";
import { User, Blog } from "@/types";
import { SkeletonTable } from "@/components/shared/SkeletonLoader";
import { NoUsers } from "@/components/shared/EmptyState";
import {
    Users,
    FileText,
    Calendar,
    Shield,
    ChevronDown,
    Trash2,
    RefreshCw,
    Sparkles,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Stats = {
    users: Record<string, number>;
    blogs: Record<string, number>;
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

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [changingRole, setChangingRole] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [roleFilter]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [usersRes, blogsRes, statsRes] = await Promise.all([
                userApi.getAllUsers(roleFilter !== "all" ? { role: roleFilter } : undefined),
                userApi.getAllBlogs(),
                userApi.getDashboardStats(),
            ]);
            setUsers(usersRes.data.data.users);
            setBlogs(blogsRes.data.data.blogs);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await userApi.changeRole(userId, newRole);
            setChangingRole(null);
            fetchData();
        } catch (error) {
            console.error("Failed to change role:", error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await userApi.deleteUser(userId);
            fetchData();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const handleBlogStatusChange = async (blogId: string, status: string) => {
        try {
            await userApi.overrideBlogStatus(blogId, status);
            fetchData();
        } catch (error) {
            console.error("Failed to change blog status:", error);
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
                    <Shield className="h-4 w-4" />
                    <span>Admin Control Center</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif mb-2 tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="text-slate-600 text-lg">Manage users, content, and system settings</p>
            </motion.div>

            {/* Stats */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
                {[
                    { label: "Total Users", value: stats ? Object.values(stats.users).reduce((a, b) => a + b, 0) : 0, icon: Users, gradient: "from-indigo-500 to-purple-600", text: "text-indigo-100" },
                    { label: "Faculty", value: stats?.users?.FACULTY || 0, icon: Shield, gradient: "from-blue-500 to-cyan-600", text: "text-blue-100" },
                    { label: "Total Blogs", value: stats ? Object.values(stats.blogs).reduce((a, b) => a + b, 0) : 0, icon: FileText, gradient: "from-emerald-500 to-teal-600", text: "text-emerald-100" },
                    { label: "Published", value: stats?.blogs?.APPROVED || 0, icon: Calendar, gradient: "from-amber-500 to-orange-600", text: "text-amber-100" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-lg`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`${stat.text} font-medium mb-1`}>{stat.label}</p>
                                <div className="text-4xl font-bold font-serif">{stat.value}</div>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Users Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">User Management</h2>
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        {["all", "STUDENT", "FACULTY", "ADMIN"].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    roleFilter === role
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {role === "all" ? "All Users" : role}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonTable />
                ) : users.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                        <NoUsers />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <AnimatePresence>
                                        {users.map((user) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={user._id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-slate-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="relative inline-block">
                                                        <button
                                                            onClick={() => setChangingRole(changingRole === user._id ? null : user._id)}
                                                            className={cn(
                                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors",
                                                                user.role === "ADMIN"
                                                                    ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                                                    : user.role === "FACULTY"
                                                                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                            )}
                                                        >
                                                            {user.role}
                                                            <ChevronDown className="h-3 w-3" />
                                                        </button>

                                                        {changingRole === user._id && (
                                                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 w-32 animate-in fade-in zoom-in duration-200">
                                                                {["STUDENT", "FACULTY", "ADMIN"].map((role) => (
                                                                    <button
                                                                        key={role}
                                                                        onClick={() => handleRoleChange(user._id, role)}
                                                                        className={cn(
                                                                            "block w-full px-4 py-2.5 text-xs font-semibold text-left transition-colors",
                                                                            user.role === role ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                                                                        )}
                                                                    >
                                                                        {role}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Blogs Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif">Content Management</h2>
                    <button
                        onClick={fetchData}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Data
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Override Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {blogs.slice(0, 10).map((blog) => (
                                    <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-slate-900 line-clamp-1 max-w-xs" title={blog.title}>
                                                {blog.title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{blog.author?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold border",
                                                    blog.status === "APPROVED"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : blog.status === "REJECTED"
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : blog.status === "PENDING_REVIEW"
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                                )}
                                            >
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <select
                                                value={blog.status}
                                                onChange={(e) => handleBlogStatusChange(blog._id, e.target.value)}
                                                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer hover:border-slate-300"
                                            >
                                                <option value="DRAFT">Draft</option>
                                                <option value="PENDING_REVIEW">Pending</option>
                                                <option value="APPROVED">Approved</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
