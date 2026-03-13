"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Task {
    id: string | number;
    title: string;
    description: string;
}

export default function TaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-xl shadow-sm mb-3 cursor-grab">
            <h3 className="font-semibold text-neutral-800">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
        </div>
    );
}