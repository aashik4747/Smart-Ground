import { useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";

export default function Documents() {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const uploadDocument = () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }
        // Mock upload
        setTimeout(() => {
            alert("Document uploaded successfully (mock)");
            setFile(null);
        }, 1000);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <DashboardLayout
            role="STALL_OWNER"
            title="Documents"
            description="Manage your required stall documentation."
        >
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                {/* Alert/Info Banner */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-blue-800">Compliance Required</h3>
                            <p className="mt-1 text-sm text-blue-600">
                                Please ensure all documents are valid and up to date. Required documents include:
                                <span className="font-semibold"> Trade License</span>,
                                <span className="font-semibold"> Food Safety Certificate</span> (for food stalls), and
                                <span className="font-semibold"> ID Proof</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-indigo-100 text-indigo-600 rounded-lg p-2 mr-3 text-lg">📤</span>
                            Upload New Document
                        </h3>

                        <div
                            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${isDragging
                                    ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                                    : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={e => setFile(e.target.files[0])}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                                <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? "bg-indigo-200 text-indigo-700" : "bg-gray-100 text-gray-400"
                                    }`}>
                                    <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="text-base font-medium text-gray-700 mb-1">
                                    {file ? <span className="text-indigo-600">{file.name}</span> : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                            </label>
                        </div>

                        {file && (
                            <div className="mt-6 animate-fade-in">
                                <button
                                    onClick={uploadDocument}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                                >
                                    Upload Document
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Check List / Existing Documents */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-gray-900 font-bold text-lg">Uploaded Documents</h3>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">1 Verified</span>
                        </div>

                        <div className="divide-y divide-gray-100 flex-grow">
                            <DocumentItem
                                name="Trade License.pdf"
                                date="12 Oct, 2023"
                                status="Verified"
                                type="PDF"
                                color="red"
                            />
                            <DocumentItem
                                name="ID Proof.jpg"
                                date="10 Oct, 2023"
                                status="Pending"
                                type="IMG"
                                color="blue"
                            />
                            <DocumentItem
                                name="Food Safety Cert.pdf"
                                date="-"
                                status="Missing"
                                type="DOC"
                                color="gray"
                            />
                        </div>

                        <div className="p-4 bg-gray-50 text-center">
                            <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All Documents →</a>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function DocumentItem({ name, date, status, type, color }) {
    const statusStyles = {
        Verified: "bg-green-100 text-green-700 border-green-200",
        Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Missing: "bg-gray-100 text-gray-500 border-gray-200 dashed border"
    };

    const typeColors = {
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
        gray: "bg-gray-100 text-gray-400"
    };

    return (
        <div className="p-4 hover:bg-indigo-50/30 transition-colors flex justify-between items-center group">
            <div className="flex items-center">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm mr-4 shadow-sm ${typeColors[color] || typeColors.gray}`}>
                    {type}
                </div>
                <div>
                    <p className={`text-sm font-bold ${status === 'Missing' ? 'text-gray-400 italic' : 'text-gray-800'}`}>{name}</p>
                    <p className="text-xs text-gray-500">{status === 'Missing' ? 'Upload required' : `Uploaded on ${date}`}</p>
                </div>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusStyles[status]}`}>
                {status}
            </span>
        </div>
    );
}

