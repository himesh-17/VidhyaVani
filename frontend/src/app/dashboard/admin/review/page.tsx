"use client";

import React, { Suspense } from "react";
import { ReviewDashboard } from "@/components/reviews/ReviewDashboard";
import { RoleGate } from "@/components/shared/RoleGate";

export default function AdminReviewPage() {
    return (
        <RoleGate allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-slate-50/50 py-8">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <ReviewDashboard basePath="/dashboard/admin/review" />
                    </Suspense>
                </div>
            </div>
        </RoleGate>
    );
}
