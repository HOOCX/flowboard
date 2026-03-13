import {prisma} from "@/lib/prisma";

export async function getTasksByTeam(teamId: string) {
    return await prisma.task.findMany({
        where: {
            teamId: teamId
        },
        orderBy: {
            createdAt: "desc"
        },
    });
}