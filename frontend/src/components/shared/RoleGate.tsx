"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
