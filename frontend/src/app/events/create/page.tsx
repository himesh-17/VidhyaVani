"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { eventApi, uploadApi } from "@/lib/api";
import { ArrowLeft, Calendar, FileText, Loader2, MapPin, Upload } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RoleGate } from "@/components/shared/RoleGate";

function CreateEventForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        venue: "",
        eventDate: "",
        coverImage: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await uploadApi.uploadImage(file);
            setFormData((prev) => ({ ...prev, coverImage: response.data.data.imageUrl }));
        } catch (error) {
            console.error("Failed to upload image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await eventApi.createEvent(formData);
            router.push("/events");
        } catch (error) {
            console.error("Failed to create event:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Link
                href="/events"
                className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
            </Link>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h1 className="text-2xl font-bold text-slate-900">Create New Event</h1>
                    <p className="text-slate-600 mt-1">Schedule a new event or workshop</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            Event Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Annual Science Fair"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what the event is about..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Venue */}
                        <div>
                            <label htmlFor="venue" className="block text-sm font-medium text-slate-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Venue
                                </span>
                            </label>
                            <input
                                type="text"
                                id="venue"
                                name="venue"
                                required
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="e.g. Main Auditorium"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-slate-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date & Time
                                </span>
                            </label>
                            <input
                                type="datetime-local"
                                id="eventDate"
                                name="eventDate"
                                required
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
                            >
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {isUploading ? "Uploading..." : "Choose Image"}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            {formData.coverImage && (
                                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                    Image Uploaded
                                </span>
                            )}
                        </div>

                        {formData.coverImage && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 h-48 w-full relative group">
                                <img
                                    src={formData.coverImage}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, coverImage: "" })}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link
                            href="/events"
                            className="px-6 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CreateEventPage() {
    return (
        <RoleGate allowedRoles={["FACULTY", "ADMIN"]}>
            <div className="min-h-screen bg-slate-50/50">
                <CreateEventForm />
            </div>
        </RoleGate>
    );
}
