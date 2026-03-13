"use client"

import {DndContext, closestCenter, DragEndEvent, useDroppable} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import TaskCard from "./TaskCard";
import { updateTaskStatus } from "@/app/dashboard/actions";


type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
};

type Props = {
    tasks: Task[];
};

function KanbanColumn({ status, tasks }: { status: string; tasks: Task[] }) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div ref={setNodeRef} className="bg-neutral-100 p-4 rounded-2xl min-h-62.5">
            <h2 className="font-semibold mb-4 text-neutral-900">{status.replace("_", " ")}</h2>

            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </SortableContext>
        </div>
    );
}

export default function KanbanBoard({ tasks }: Props) {
    const [localTask, setLocalTasks] = useState(tasks);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        const taskIndex = localTask.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) return;

        let newStatus = overId;
        const taskWeHoveredOver = localTask.find((task) => task.id === overId);
        if (taskWeHoveredOver) {
            newStatus = taskWeHoveredOver.status;
        }

        if (localTask[taskIndex].status === newStatus) return;


        setLocalTasks((prev) => 
            prev.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );

        try {
            await updateTaskStatus(taskId, localTask[taskIndex].status);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const columns = ["TODO", "IN_PROGRESS", "DONE"];

    return (
        <DndContext id="kanban-board" collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-6">
                {columns.map((status) => (
                    <KanbanColumn key={status} status={status} tasks={localTask.filter((task) => task.status === status)} />
                ))}
            </div>
        </DndContext>
    );
}