import Sidebar from "./Sidebar";

export default function DashboardLayout({ role, title, description, children, actions }) {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar role={role} />

            <main className="flex-1 overflow-y-auto p-8 border-l border-gray-200">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                        {description && <p className="text-gray-500 mt-1">{description}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </header>

                {children}
            </main>
        </div>
    );
}
