"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { Blog } from "@/types";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";
import { NoBlogs } from "@/components/shared/EmptyState";
import { Calendar, User, ArrowRight, Sparkles, Search } from "lucide-react";
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

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await blogApi.getPublicBlogs();
            setBlogs(response.data.data.blogs);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-16 relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-4"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Academic Insights</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-serif tracking-tight"
                >
                    Published Articles
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                >
                    Discover thought-provoking ideas, research, and stories from our vibrant community of students and faculty.
                </motion.p>
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : blogs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <NoBlogs />
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {blogs.map((blog) => (
                        <motion.div
                            key={blog._id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="h-full"
                        >
                            <Link
                                href={`/blogs/${blog.slug}`}
                                className="group block h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                            >
                                {blog.coverImage ? (
                                    <div className="h-56 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors z-10 duration-300" />
                                        <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-56 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                        <span className="text-6xl font-black text-white/20 font-serif transform group-hover:scale-110 transition-transform duration-500 select-none">
                                            {blog.title.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                                            Article
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 font-serif leading-tight">
                                        {blog.title}
                                    </h2>
                                    <p className="text-slate-600 text-base mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {blog.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center gap-3">
                                            {blog.author?.avatar ? (
                                                <img src={blog.author.avatar} alt={blog.author.name} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-xs font-bold border border-white shadow-sm">
                                                    {blog.author?.name?.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-sm font-semibold text-slate-700">{blog.author?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                                            Read
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
