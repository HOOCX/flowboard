export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 hidden md:block">
        <h2 className="text-xl font-semibold mb-8 text-neutral-800">FlowBoard</h2>

        <nav className="space-y-4 text-sm">
            <p className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Dashboard
            </p>
            <p className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Tasks
            </p>
            <p className="text-gray-600 hover:text-gray-900 cursor-pointer">
                Team
            </p>
            </nav>

      </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10">
            {children}
            </div>
    </div>
  );
}