
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                {/* Top Header Bar usually found in productivity apps */}
                <header className="h-16 border-b border-[#dadce0] flex items-center justify-between px-8 bg-white sticky top-0 z-10">
                    <h2 className="text-xl text-gray-600">Overview</h2>
                    <div className="flex items-center gap-4">
                        <input type="search" placeholder="Search cases, clients..." className="bg-[#f1f3f4] border-none rounded-lg px-4 py-2 text-sm w-96 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">JD</div>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
