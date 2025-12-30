"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { eventApi } from "@/lib/api";
import { EventForm } from "@/components/events/EventForm";
import { RoleGate } from "@/components/shared/RoleGate";

export default function FacultyCreateEventPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await eventApi.createEvent(data);
        router.push("/dashboard/faculty");
    };

    return (
        <RoleGate allowedRoles={["FACULTY"]}>
            <div className="min-h-screen bg-slate-50/50 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Faculty Dashboard</h1>
                    <EventForm onSubmit={handleSubmit} backLink="/dashboard/faculty" />
                </div>
            </div>
        </RoleGate>
    );
}
