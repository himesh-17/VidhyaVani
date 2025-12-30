"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { reviewApi, blogApi } from "@/lib/api";
import { Blog } from "@/types";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";
import { NoPendingReviews } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle, XCircle, Calendar, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewDashboardProps {
    basePath: string;
}

export function ReviewDashboard({ basePath }: ReviewDashboardProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedBlogId = searchParams.get("blog");

    const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isActioning, setIsActioning] = useState(false);

    useEffect(() => {
        fetchPendingBlogs();
    }, []);

    useEffect(() => {
        if (selectedBlogId) {
            fetchBlogDetails(selectedBlogId);
        } else {
            setSelectedBlog(null);
        }
    }, [selectedBlogId]);

    const fetchPendingBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await reviewApi.getPendingBlogs();
            setPendingBlogs(response.data.data.blogs);
        } catch (error) {
            console.error("Failed to fetch pending blogs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBlogDetails = async (id: string) => {
        try {
            const response = await blogApi.getBlogById(id);
            setSelectedBlog(response.data.data.blog);
        } catch (error) {
            console.error("Failed to fetch blog:", error);
        }
    };

    const handleApprove = async () => {
        if (!selectedBlog) return;
        setIsActioning(true);
        try {
            await reviewApi.approveBlog(selectedBlog._id);
            setSelectedBlog(null);
            fetchPendingBlogs();
            router.push(basePath);
        } catch (error) {
            console.error("Failed to approve:", error);
        } finally {
            setIsActioning(false);
        }
    };

    const handleReject = async () => {
        if (!selectedBlog || !rejectReason.trim()) return;
        setIsActioning(true);
        try {
            await reviewApi.rejectBlog(selectedBlog._id, rejectReason);
            setSelectedBlog(null);
            setShowRejectModal(false);
            setRejectReason("");
            fetchPendingBlogs();
            router.push(basePath);
        } catch (error) {
            console.error("Failed to reject:", error);
        } finally {
            setIsActioning(false);
        }
    };

    if (selectedBlog) {
        return (
            <div>
                <Link
                    href={basePath}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Pending Reviews
                </Link>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">{selectedBlog.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {selectedBlog.author?.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(selectedBlog.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn("p-8 min-h-[400px]", selectedBlog.theme === "dark" ? "bg-slate-900 text-white" : "bg-white")}
                        style={{
                            fontFamily: selectedBlog.fontFamily,
                            fontSize: `${selectedBlog.fontSize}px`,
                            color: selectedBlog.theme === "dark" ? "#fff" : selectedBlog.fontColor,
                        }}
                    >
                        {selectedBlog.coverImage && (
                            <img src={selectedBlog.coverImage} alt={selectedBlog.title} className="w-full h-64 object-cover rounded-lg mb-8" />
                        )}
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                    </div>

                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-4">
                        <button
                            onClick={handleApprove}
                            disabled={isActioning}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {isActioning ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                            Approve Blog
                        </button>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            disabled={isActioning}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            <XCircle className="h-5 w-5" />
                            Reject Blog
                        </button>
                    </div>
                </div>

                {showRejectModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Reject Blog</h2>
                            <p className="text-slate-600 mb-4">Please provide a reason for rejection.</p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="w-full p-4 rounded-lg border border-slate-300 focus:border-red-500 outline-none resize-none"
                                rows={4}
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim() || isActioning}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isActioning ? "Rejecting..." : "Confirm Rejection"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Review Submissions</h1>
            <p className="text-slate-600 mb-8">Review and approve or reject pending blog submissions</p>

            {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : pendingBlogs.length === 0 ? (
                <NoPendingReviews />
            ) : (
                <div className="space-y-4">
                    {pendingBlogs.map((blog) => (
                        <Link
                            key={blog._id}
                            href={`${basePath}?blog=${blog._id}`}
                            className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-6">
                                {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-32 h-24 object-cover rounded-lg" />}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-2">{blog.title}</h2>
                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span>By {blog.author?.name}</span>
                                        <span>•</span>
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
