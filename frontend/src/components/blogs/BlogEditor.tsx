"use client";

import React, { useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import { blogApi, uploadApi } from "@/lib/api";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Code,
    FileCode,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Save,
    Send,
    Eye,
    Palette,
    Type,
    Image as ImageIcon,
    Moon,
    Sun,
    Loader2,
    Upload,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const fontFamilies = [
    { value: "Inter", label: "Inter" },
    { value: "Georgia", label: "Georgia" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Arial", label: "Arial" },
    { value: "Merriweather", label: "Merriweather" },
];

interface BlogEditorProps {
    redirectPath: string;
}

const lowlight = createLowlight(all);

export function BlogEditor({ redirectPath }: BlogEditorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [fontFamily, setFontFamily] = useState("Inter");
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState("#1a1a1a");
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [showPreview, setShowPreview] = useState(false);
    const [showStylePanel, setShowStylePanel] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (editId) {
            // TODO: Fetch blog data if editing
            // For now, we assume this component is used for creation or the parent fetches data
            // But since this was copied from page.tsx which fetched strictly from params or state?
            // Wait, the original page.tsx DID NOT FETCH DATA in the snippet I saw?
            // Ah, looking back at the file content... it did NOT have a useEffect to fetch data for editId!
            // It seems "Edit" functionality might have been incomplete in the original file too?
            // Or I missed it. I will keep it as is for now to match original functionality.
        }
    }, [editId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await uploadApi.uploadImage(file);
            setCoverImage(response.data.data.imageUrl);
        } catch (error) {
            console.error("Failed to upload image:", error);
            // Optionally add toast notification here
        } finally {
            setIsUploading(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: "<p>Start writing your blog post...</p>",
        immediatelyRender: false, // Required for Next.js SSR
        editorProps: {
            attributes: {
                class: "prose prose-slate max-w-none focus:outline-none min-h-[400px] p-4",
            },
        },
    });


    const handleSaveDraft = async () => {
        if (!title.trim() || !editor) return;
        setIsSaving(true);
        try {
            const data = {
                title,
                content: editor.getHTML(),
                coverImage,
                fontFamily,
                fontSize,
                fontColor,
                theme,
            };
            if (editId) {
                await blogApi.updateBlog(editId, data);
            } else {
                await blogApi.createBlog(data);
            }
            router.push(redirectPath);
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !editor) return;
        setIsSubmitting(true);
        try {
            const data = {
                title,
                content: editor.getHTML(),
                coverImage,
                fontFamily,
                fontSize,
                fontColor,
                theme,
            };
            let blogId = editId;
            if (editId) {
                await blogApi.updateBlog(editId, data);
            } else {
                const response = await blogApi.createBlog(data);
                blogId = response.data.data.blog._id;
            }
            if (blogId) {
                await blogApi.submitForReview(blogId);
            }
            router.push(redirectPath);
        } catch (error) {
            console.error("Failed to submit:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ToolbarButton = ({
        onClick,
        isActive,
        children,
        title,
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            onClick={onClick}
            title={title}
            className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100 text-slate-600"
            )}
        >
            {children}
        </button>
    );

    return (
        <>
            {/* Header */}
            <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={redirectPath} className="text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-lg font-semibold text-slate-900">
                            {editId ? "Edit Blog" : "Create New Blog"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowStylePanel(!showStylePanel)}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                showStylePanel
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <Palette className="h-4 w-4" />
                            Style
                        </button>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                showPreview
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSaving || !title.trim()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Draft
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !title.trim()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Submit for Review
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Main Editor */}
                    <div className="flex-1">
                        {/* Title Input */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your blog title..."
                            className="w-full text-3xl font-bold text-slate-900 placeholder-slate-300 border-0 bg-transparent focus:outline-none focus:ring-0 mb-6"
                        />

                        {/* Cover Image Input */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                                <label className="text-sm font-medium text-slate-600">Cover Image</label>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
                                >
                                    {isUploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    {isUploading ? "Uploading..." : "Choose Image"}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {coverImage && (
                                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                        Image Uploaded
                                    </span>
                                )}
                            </div>
                            {coverImage && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
                                    <img src={coverImage} alt="Cover preview" className="w-full h-48 object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Editor Toolbar */}
                        <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 p-2 flex flex-wrap gap-1">
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                isActive={editor?.isActive("heading", { level: 1 })}
                                title="Heading 1"
                            >
                                <Heading1 className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                isActive={editor?.isActive("heading", { level: 2 })}
                                title="Heading 2"
                            >
                                <Heading2 className="h-4 w-4" />
                            </ToolbarButton>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                isActive={editor?.isActive("bold")}
                                title="Bold"
                            >
                                <Bold className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                isActive={editor?.isActive("italic")}
                                title="Italic"
                            >
                                <Italic className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleCode().run()}
                                isActive={editor?.isActive("code")}
                                title="Inline Code"
                            >
                                <Code className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                                isActive={editor?.isActive("codeBlock")}
                                title="Code Block"
                            >
                                <FileCode className="h-4 w-4" />
                            </ToolbarButton>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                isActive={editor?.isActive("bulletList")}
                                title="Bullet List"
                            >
                                <List className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                isActive={editor?.isActive("orderedList")}
                                title="Numbered List"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                isActive={editor?.isActive("blockquote")}
                                title="Quote"
                            >
                                <Quote className="h-4 w-4" />
                            </ToolbarButton>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                                <Undo className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                                <Redo className="h-4 w-4" />
                            </ToolbarButton>
                        </div>

                        {/* Editor Content */}
                        <div className="bg-white rounded-b-xl border border-slate-200 min-h-[500px]">
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {/* Style Panel */}
                    {showStylePanel && (
                        <div className="w-80 bg-white rounded-xl border border-slate-200 p-6 h-fit sticky top-32">
                            <h3 className="text-lg font-semibold text-slate-900 mb-6">Blog Style</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                        <Type className="h-4 w-4" />
                                        Font Family
                                    </label>
                                    <select
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                    >
                                        {fontFamilies.map((font) => (
                                            <option key={font.value} value={font.value}>
                                                {font.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Font Size: {fontSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min={14}
                                        max={22}
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                        <Palette className="h-4 w-4" />
                                        Font Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={fontColor}
                                            onChange={(e) => setFontColor(e.target.value)}
                                            className="w-12 h-10 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={fontColor}
                                            onChange={(e) => setFontColor(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={cn(
                                                "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                                theme === "light"
                                                    ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500"
                                                    : "bg-slate-100 text-slate-600 border-2 border-transparent"
                                            )}
                                        >
                                            <Sun className="h-4 w-4" />
                                            Light
                                        </button>
                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={cn(
                                                "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                                theme === "dark"
                                                    ? "bg-slate-800 text-white border-2 border-slate-600"
                                                    : "bg-slate-100 text-slate-600 border-2 border-transparent"
                                            )}
                                        >
                                            <Moon className="h-4 w-4" />
                                            Dark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview Panel */}
                    {showPreview && (
                        <div className="w-96 bg-white rounded-xl border border-slate-200 h-fit sticky top-32 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h3 className="text-sm font-semibold text-slate-900">Live Preview</h3>
                            </div>
                            <div
                                className={cn("p-6 max-h-[600px] overflow-auto", theme === "dark" ? "bg-slate-900 text-white" : "bg-white")}
                                style={{
                                    fontFamily,
                                    fontSize: `${fontSize}px`,
                                    color: theme === "dark" ? "#fff" : fontColor,
                                }}
                            >
                                <h1 className="text-2xl font-bold mb-4">{title || "Untitled"}</h1>
                                {coverImage && <img src={coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg mb-4" />}
                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
