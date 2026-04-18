export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-center py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">Smart Ground</span>. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy Policy</a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Terms of Service</a>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Contact Support</a>
                </div>
            </div>
        </footer>
    );
}
