import { LucideIcon, FileText, Calendar, Users, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-4 text-center",
                className
            )}
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <Icon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

// Pre-configured empty states
export function NoBlogs({ onAction }: { onAction?: () => void }) {
    return (
        <EmptyState
            icon={FileText}
            title="No blogs yet"
            description="Get started by creating your first blog post"
            action={onAction ? { label: "Create Blog", onClick: onAction } : undefined}
        />
    );
}

export function NoEvents({ onAction }: { onAction?: () => void }) {
    return (
        <EmptyState
            icon={Calendar}
            title="No events scheduled"
            description="There are no upcoming events at the moment"
            action={onAction ? { label: "Create Event", onClick: onAction } : undefined}
        />
    );
}

export function NoPendingReviews() {
    return (
        <EmptyState
            icon={FileText}
            title="All caught up!"
            description="There are no blogs pending review at this time"
        />
    );
}

export function NoUsers() {
    return (
        <EmptyState
            icon={Users}
            title="No users found"
            description="No users match your current filters"
        />
    );
}
