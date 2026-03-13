import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTask } from "./actions";
//import TaskStatusButton from "@/components/TaskStatusButton";
import KanbanBoard from "@/components/KanbanBoard";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    const isAdmin = user?.role === "ADMIN";

    if (!user?.teamId) {
        return <p className="p-10">You are not part of a team. Please contact your administrator.</p>;
    }

    const rawTasks = await prisma.task.findMany({
        where: {
            teamId: user.teamId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const tasks = rawTasks.map((task: typeof rawTasks[number]) => ({
        ...task,
        description: task.description || "",
    }));

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task: { status: string }) => task.status === "DONE").length;
    const inProgressTasks = tasks.filter((task: { status: string }) => task.status === "IN_PROGRESS").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-neutral-900">Welcome back, {session.user.name || session.user.email}!</h1>

      <p className="text-neutral-600 mb-10">
        {/* Role display removed - add 'role' property to User type in auth config if needed */}
      </p>
      
      {/* Metrics Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
            <MetricCard  title="Total Tasks" value={totalTasks.toString()} />
            <MetricCard title="Completed" value={completedTasks.toString()} />
            <MetricCard title="In Progress" value={inProgressTasks.toString()} />
        </div>

        {/* Create Task Form */}
        {isAdmin && (
        <form action={createTask} className="mb-10 space-y-4 bg-white border-neutral-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-neutral-900">Create New Task</h2>

            <input
                name="title"
                placeholder="Task title"
                className="w-full border p-3 rounded-xl text-neutral-900"
                required
            />

            <textarea
                name="description"
                placeholder="Task description"
                className="w-full border p-3 rounded-xl text-neutral-900"
                rows={4}
            />

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Create Task
            </button>
        </form>
        )}

        {/* Task List */}
        <KanbanBoard tasks={tasks} />

    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
      <p className="text-sm text-neutral-900">{title}</p>
      <p className="text-2xl font-bold mt-2 text-neutral-900">{value}</p>
    </div>
  );
}

/*function TaskRow({id, title, status }: { id: string; title: string; status: string }) {
    return (
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <p>{title}</p>

            <TaskStatusButton taskId={id} currentStatus={status} />
        </div>
    );
}
*/