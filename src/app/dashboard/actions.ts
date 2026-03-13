"use server";

import {prisma} from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

   

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    if (!title) {
        throw new Error("Title is required");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user?.teamId) {
        throw new Error("User has not team");
    }

     if ( user.role !== "ADMIN") {
        throw new Error("Forbidden: only admins can create tasks");
    }

    await prisma.task.create({
        data: {
            title,
            description,
            teamId: user.teamId,
            assignedToId: user.id,
        },
    });

    revalidatePath("/dashboard");
}

export async function updateTaskStatus(taskId: string, currentStatus: string) {
    const session = await auth();
    
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (!task || task.teamId !== user.teamId) {
        throw new Error("Forbbidden");
    }

    const nextStatus = currentStatus === "TODO" ? "IN_PROGRESS" : currentStatus === "IN_PROGRESS" ? "DONE" : "TODO";
    
    await prisma.task.update({
        where: { id: taskId },
        data: { status: nextStatus },
    });

    revalidatePath("/dashboard");
}

