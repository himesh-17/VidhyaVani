"use client";

import React, { Suspense } from "react";
import { BlogEditor } from "@/components/blogs/BlogEditor";
import { RoleGate } from "@/components/shared/RoleGate";

export default function FacultyCreateBlogPage() {
    return (
        <RoleGate allowedRoles={["FACULTY"]}>
            <div className="min-h-screen bg-slate-50/50 py-8">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <BlogEditor redirectPath="/dashboard/faculty" />
                    </Suspense>
                </div>
            </div>
        </RoleGate>
    );
}
