"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                // Redirect to role-specific dashboard
                switch (user.role) {
                    case "ADMIN":
                        router.replace("/dashboard/admin");
                        break;
                    case "FACULTY":
                        router.replace("/dashboard/faculty");
                        break;
                    default:
                        router.replace("/dashboard/student");
                }
            } else {
                // If not loading and no user (auth failed), redirect to login
                router.replace("/auth/login");
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-slate-600">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
