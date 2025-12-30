"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    Home,
    BookOpen,
    Calendar,
    PenSquare,
    Users,
    ClipboardCheck,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    ChevronDown,
} from "lucide-react";

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const publicLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/blogs", label: "Blogs", icon: BookOpen },
        { href: "/events", label: "Events", icon: Calendar },
        { href: "/about", label: "About", icon: Settings },
    ];

    const getAuthenticatedLinks = () => {
        const links = [
            { href: "/dashboard", label: "Dashboard", icon: Home },
        ];

        if (user?.role === "STUDENT") {
            links.push({ href: "/dashboard/student/blogs/create", label: "Write", icon: PenSquare });
        } else if (user?.role === "FACULTY") {
            links.push({ href: "/dashboard/faculty/blogs/create", label: "Write", icon: PenSquare });
        } else if (user?.role === "ADMIN") {
            links.push({ href: "/dashboard/admin/blogs/create", label: "Write", icon: PenSquare });
        }

        if (user?.role === "FACULTY") {
            links.push({ href: "/dashboard/faculty/review", label: "Review", icon: ClipboardCheck });
        }

        if (user?.role === "ADMIN") {
            links.push({ href: "/dashboard/admin/review", label: "Review", icon: ClipboardCheck });
        }

        if (user?.role === "ADMIN") {
            links.push({ href: "/dashboard/admin", label: "Admin", icon: Users });
        }

        return links;
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <nav className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                            {/* <BookOpen className="h-5 w-5 text-white" /> */}
                            <img src="/icon.jpg" alt="VidyaVani Logo" className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            VidyaVani
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {(isAuthenticated ? getAuthenticatedLinks() : publicLinks).map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500">{user?.role}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200">
                        <div className="space-y-1">
                            {(isAuthenticated ? getAuthenticatedLinks() : publicLinks).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                                        pathname === link.href
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-100"
                                    )}
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                                    >
                                        <User className="h-5 w-5" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 space-y-2">
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full px-4 py-3 text-center text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
