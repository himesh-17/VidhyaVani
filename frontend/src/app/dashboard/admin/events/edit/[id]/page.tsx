"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eventApi } from "@/lib/api";
import { EventForm } from "@/components/events/EventForm";
import { RoleGate } from "@/components/shared/RoleGate";
import { Loader2 } from "lucide-react";

export default function AdminEditEventPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await eventApi.getEvent(params.id);
                const event = response.data.data.event;
                setInitialData({
                    title: event.title,
                    description: event.description || "",
                    venue: event.venue,
                    eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
                    coverImage: event.coverImage || "",
                });
            } catch (error) {
                console.error("Failed to fetch event:", error);
                router.push("/events");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [params.id, router]);

    const handleSubmit = async (data: any) => {
        await eventApi.updateEvent(params.id, data);
        router.push("/events");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <RoleGate allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-slate-50/50 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>
                    <EventForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        isEditing={true}
                        backLink="/dashboard/admin"
                    />
                </div>
            </div>
        </RoleGate>
    );
}
