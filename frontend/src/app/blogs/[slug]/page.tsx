"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { Blog } from "@/types";
import { Skeleton, SkeletonText } from "@/components/shared/SkeletonLoader";
import { Calendar, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import parse, { DOMNode, Element, domToReact, HTMLReactParserOptions } from "html-react-parser";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

const CodeBlock = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const codeText = typeof children === "string"
            ? children
            : Array.isArray(children)
                ? children.map(child => (typeof child === 'string' ? child : '')).join('') // Simple fallback
                : "";

        // Attempt to get text content from ref or DOM would be better, but for now:
        // Since children passed from html-react-parser might be complex, let's try to grab text from the rendered node if possible.
        // Actually, for a simple implementation, we can just grab the textContent of the code block ref.
    };

    // Better approach: Use a Ref to get the text content
    const codeRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, [children]);

    const copyToClipboard = () => {
        if (codeRef.current) {
            navigator.clipboard.writeText(codeRef.current.textContent || "");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative group rounded-xl overflow-hidden my-8 not-prose shadow-sm border border-slate-200 dark:border-slate-800">


            {/* Copy Button */}
            <button
                onClick={copyToClipboard}
                className={cn(
                    "absolute top-3 right-3 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10",
                    copied
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
                title="Copy code"
            >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className={cn("!m-0 !p-4 !bg-[#1E1E1E] overflow-x-auto text-sm leading-relaxed font-mono", className)}>
                <code ref={codeRef} className={cn("language-javascript", className)}>
                    {children}
                </code>
            </pre>
        </div>
    );
};

export default function BlogPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setIsLoading(true);
                const response = await blogApi.getBlogBySlug(slug);
                setBlog(response.data.data.blog);
            } catch {
                setError("Blog not found");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    // Parser options to replace pre > code with custom CodeBlock
    const parseOptions: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === "pre") {
                const codeNode = domNode.children.find(
                    (child) => child instanceof Element && child.name === "code"
                ) as Element | undefined;

                if (codeNode) {
                    const className = codeNode.attribs.class;
                    return (
                        <CodeBlock className={className}>
                            {domToReact(codeNode.children as DOMNode[])}
                        </CodeBlock>
                    );
                }
            }
        },
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Skeleton className="h-64 w-full mb-8" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <SkeletonText lines={10} />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Blog Not Found</h1>
                <p className="text-slate-600 mb-8">The blog you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <article
            className={cn(
                "min-h-screen transition-colors duration-500",
                blog.theme === "dark" ? "bg-[#0B1120] text-slate-300" : "bg-[#FDFBF7] text-slate-600"
            )}
        >
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
                <div
                    className="h-full bg-indigo-600/80 transition-all duration-150 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/blogs"
                    className={cn(
                        "inline-flex items-center gap-2 text-sm font-medium transition-colors mb-8",
                        blog.theme === "dark"
                            ? "text-slate-400 hover:text-white hover:bg-white/5"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                        "px-3 py-1.5 rounded-full"
                    )}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 pb-20 max-w-4xl"> {/* Standard container, content limited inside */}

                {/* Blog Header Section */}
                <header className="mb-16 text-center max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase text-indigo-500">
                        {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        })}
                    </div>

                    <h1
                        className={cn(
                            "text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-8 leading-tight tracking-tight",
                            blog.theme === "dark" ? "text-white" : "text-slate-900"
                        )}
                        style={{ fontFamily: blog.fontFamily }}
                    >
                        {blog.title}
                    </h1>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                {blog.author?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className={cn("text-sm font-semibold", blog.theme === "dark" ? "text-slate-200" : "text-slate-900")}>
                                    {blog.author?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {blog.coverImage && (
                    <div className="w-full aspect-[21/9] overflow-hidden rounded-2xl mb-16 shadow-2xl shadow-indigo-500/10">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}

                {/* Blog Content */}
                <div
                    className={cn(
                        "prose prose-lg prose-slate mx-auto max-w-2xl", // Limit width for readability
                        "prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight",
                        "prose-p:leading-8 prose-p:font-light", /* Relaxed reading */
                        "prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-700 transition-colors",
                        "prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8",
                        "prose-blockquote:border-l-2 prose-blockquote:border-indigo-500 prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-xl",
                        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0", // Reset pre styles
                        "prose-li:marker:text-indigo-500",
                        blog.theme === "dark"
                            ? "prose-invert prose-p:text-slate-300 prose-headings:text-white"
                            : "prose-p:text-slate-700 prose-headings:text-slate-900"
                    )}
                    style={{
                        fontFamily: blog.fontFamily,
                        fontSize: blog.fontSize ? `${blog.fontSize}px` : undefined, // Allow override but default to prose-lg
                    }}
                >
                    {parse(blog.content, parseOptions)}
                </div>

                {/* Footer */}
                <footer
                    className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800 max-w-2xl mx-auto"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                {blog.author?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className={cn("font-medium", blog.theme === "dark" ? "text-white" : "text-slate-900")}>
                                    Written by {blog.author?.name}
                                </p>
                                <p className={cn("text-sm", blog.theme === "dark" ? "text-slate-500" : "text-slate-500")}>
                                    Thanks for reading!
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleShare}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95",
                                copied
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            )}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                            {copied ? "Copied Link" : "Share Article"}
                        </button>
                    </div>
                </footer>
            </div>
        </article>
    );
}
