"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { User as UserIcon, Mail, Shield, Calendar, Save, Loader2, Sparkles, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!name.trim()) return;
        setIsSaving(true);
        setMessage("");

        try {
            await userApi.updateProfile({ name, avatar: avatar || undefined });
            await refreshUser();
            setMessage("Profile updated successfully!");
        } catch (error) {
            setMessage("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    <span>Personal Information</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 font-serif">Your Profile</h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 h-40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                </div>

                <div className="px-8 pb-10">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 mb-10 relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-2xl relative group overflow-hidden"
                        >
                            {avatar ? (
                                <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </motion.div>
                        <div className="pb-3 flex-1">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">{user.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                                    <Shield className="h-3 w-3" />
                                    {user.role}
                                </span>
                                <span className="text-slate-400 text-sm">•</span>
                                <span className="text-slate-500 text-sm font-medium">Member since {new Date(user.createdAt).getFullYear()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-8 max-w-xl">
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.includes("success")
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : "bg-red-50 text-red-700 border border-red-100"
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${message.includes("success") ? "bg-emerald-500" : "bg-red-500"}`} />
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5">
                                <UserIcon className="h-4 w-4 text-indigo-500" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5">
                                <Mail className="h-4 w-4 text-indigo-500" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-400 mt-2 ml-1">Email address needs admin approval to change.</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5">
                                <Camera className="h-4 w-4 text-indigo-500" />
                                Avatar URL
                            </label>
                            <input
                                type="url"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-slate-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    <Shield className="h-3 w-3" />
                                    System Role
                                </label>
                                <p className="text-slate-900 font-bold">{user.role}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    <Calendar className="h-3 w-3" />
                                    Joined Date
                                </label>
                                <p className="text-slate-900 font-bold">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleSave}
                            disabled={isSaving || !name.trim()}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all text-lg"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save Profile Changes
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
