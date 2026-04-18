import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllGrounds, createGround, updateGround, deleteGround } from "../../services/adminService";
import { getAllVenues } from "./adminService";
import { useToast } from "../../components/common/Toast";
import { SPORT_CONFIGS } from "../../utils/sportImageGenerator";

export default function AdminGrounds() {
    const [grounds, setGrounds] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedGround, setSelectedGround] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        sport: "",
        venue: "",
        pricePerHour: "",
        width: "",
        length: "",
        turfType: "Grass"
    });
    const { success, error: showError } = useToast();

    const sports = Object.keys(SPORT_CONFIGS);

    useEffect(() => {
        loadGrounds();
        loadVenues();
    }, []);

    const loadGrounds = async () => {
        setLoading(true);
        try {
            const data = await getAllGrounds();
            setGrounds(data);
        } catch (err) {
            showError("Failed to load grounds");
        } finally {
            setLoading(false);
        }
    };

    const loadVenues = async () => {
        try {
            const data = await getAllVenues();
            setVenues(data);
        } catch (err) {
            console.error("Failed to load venues");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setSelectedGround(null);
        setFormData({
            name: "",
            description: "",
            imageUrl: "",
            sport: "",
            venue: "",
            pricePerHour: "",
            width: "",
            length: "",
            turfType: "Grass"
        });
        setShowModal(true);
    };

    const openEditModal = (ground) => {
        setSelectedGround(ground);
        setFormData({
            name: ground.name || "",
            description: ground.description || "",
            imageUrl: ground.imageUrl || "",
            sport: ground.sport || "",
            venue: ground.venue?._id || "",
            pricePerHour: ground.pricePerHour || "",
            width: ground.width || "",
            length: ground.length || "",
            turfType: ground.turfType || "Grass"
        });
        setShowModal(true);
    };

    const openDeleteConfirm = (ground) => {
        setSelectedGround(ground);
        setShowDeleteConfirm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedGround) {
                await updateGround(selectedGround._id, formData);
                success("Ground updated successfully");
            } else {
                await createGround(formData);
                success("Ground created successfully");
            }
            setShowModal(false);
            loadGrounds();
        } catch (err) {
            showError(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteGround(selectedGround._id);
            success("Ground deleted successfully");
            setShowDeleteConfirm(false);
            loadGrounds();
        } catch (err) {
            showError("Failed to delete ground");
        }
    };

    return (
        <DashboardLayout role="ADMIN" title="Manage Grounds" description="System-side overview of all sports grounds across venues.">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                {/* Header with Add Button */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">All Grounds</h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Ground
                    </button>
                </div>

                {loading ? <div className="p-10"><Loader /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-bold">Ground</th>
                                    <th className="px-6 py-4 font-bold">Venue</th>
                                    <th className="px-6 py-4 font-bold">Sport</th>
                                    <th className="px-6 py-4 font-bold">Price</th>
                                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {grounds.map(g => (
                                    <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{g.name}</p>
                                            <p className="text-xs text-gray-500">{g.description || 'No description'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {g.venue?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                                                {g.sport}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">₹{g.pricePerHour || g.price}</span>
                                            <span className="text-xs text-gray-500">/hour</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(g)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(g)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {grounds.length === 0 && <tr><td colSpan="5" className="text-center p-8 text-gray-500">No Grounds Found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleSubmit} className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {selectedGround ? 'Edit Ground' : 'Create New Ground'}
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ground Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter ground name"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter ground description"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                                            <select
                                                name="sport"
                                                value={formData.sport}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select Sport</option>
                                                {sports.map(sport => (
                                                    <option key={sport} value={sport}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                                            <select
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select Venue</option>
                                                {venues.map(venue => (
                                                    <option key={venue._id} value={venue._id}>{venue.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/hour)</label>
                                            <input
                                                type="number"
                                                name="pricePerHour"
                                                value={formData.pricePerHour}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Turf Type</label>
                                            <select
                                                name="turfType"
                                                value={formData.turfType}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="Grass">Grass</option>
                                                <option value="Artificial">Artificial</option>
                                                <option value="Synthetic">Synthetic</option>
                                                <option value="Clay">Clay</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                                            <input
                                                type="number"
                                                name="width"
                                                value={formData.width}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
                                            <input
                                                type="number"
                                                name="length"
                                                value={formData.length}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        {selectedGround ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setShowDeleteConfirm(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full p-6">
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Ground</h3>
                                <p className="text-gray-500 mb-6">
                                    Are you sure you want to delete <span className="font-semibold">{selectedGround?.name}</span>? This action cannot be undone.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
