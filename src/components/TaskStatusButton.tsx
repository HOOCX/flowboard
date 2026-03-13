"use client";

import { useState, useTransition } from "react";
import { updateTaskStatus } from "@/app/dashboard/actions";

type Props = {
    taskId: string;
    currentStatus: string;
};

export default function TaskStatusButton({ taskId, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState(currentStatus);

    const nextStatus = (current: string) => {
        if (current === "TODO") return "IN_PROGRESS";
        if (current === "IN_PROGRESS") return "DONE";
        return "TODO";
    };

    const handleClick = () => {
        const newStatus = nextStatus(status);
        setStatus(newStatus);

        startTransition(async () => {
            try {
                await updateTaskStatus(taskId, status);
            } catch (error) {
                console.error("Failed to update task status:", error);
                setStatus(status); // Revert to previous status on error
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`px-3 py-1 rounded-full text-sm transition ${
                status === "TODO" ? "bg-gray-200 text-gray-700" :
                status === "IN_PROGRESS" ? "bg-yellow-200 text-yellow-700" :
                "bg-green-200 text-green-700"
            } ${isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
        >
            {status.replace("_", " ")}
        </button>
    );
}