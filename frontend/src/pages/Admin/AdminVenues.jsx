import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllVenues, createVenue, updateVenue, deleteVenue, approveVenue } from "../../services/adminService";
import { INDIA_STATES_CITIES } from "../../utils/indiaLocations";
import { useToast } from "../../components/common/Toast";

const SPORTS_OPTIONS = ["Cricket", "Football", "Volleyball", "Basketball", "Badminton", "Tennis"];
const AMENITIES_OPTIONS = ["Parking", "Spectator Seating", "Floodlights", "AC", "Changing Room", "Equipment Rental"];

export default function AdminVenues() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        locationLink: "",
        sports: [],
        amenities: [],
        images: [],
        pricePerHour: "",
        openingTime: "08:00",
        closingTime: "22:00",
        manager: "",
        isActive: true
    });
    const { success, error: showError } = useToast();

    const states = Object.keys(INDIA_STATES_CITIES);
    const cities = formData.state ? INDIA_STATES_CITIES[formData.state] : [];

    useEffect(() => {
        loadVenues();
    }, []);

    const loadVenues = async () => {
        setLoading(true);
        try {
            const data = await getAllVenues();
            setVenues(data);
        } catch (err) {
            showError("Failed to load venues");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'state' ? { city: '' } : {})
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = [];
        const newPreviews = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
            newImages.push(file);
        });

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSports = (sport) => {
        setFormData(prev => ({
            ...prev,
            sports: prev.sports.includes(sport)
                ? prev.sports.filter(s => s !== sport)
                : [...prev.sports, sport]
        }));
    };

    const handleAmenities = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const validateForm = () => {
        const required = ['name', 'description', 'address', 'city', 'state', 'pricePerHour', 'openingTime', 'closingTime'];
        const missing = required.filter(field => !formData[field] || formData[field] === '');

        if (missing.length > 0) {
            showError(`Please fill in all required fields: ${missing.join(', ')}`);
            return false;
        }

        if (formData.sports.length === 0) {
            showError("Please select at least one sport");
            return false;
        }

        if (isNaN(formData.pricePerHour) || parseFloat(formData.pricePerHour) <= 0) {
            showError("Please enter a valid price per hour");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitLoading(true);
        try {
            const submitData = new FormData();

            // Add basic fields
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('address', formData.address);
            submitData.append('city', formData.city);
            submitData.append('state', formData.state);
            submitData.append('locationLink', formData.locationLink);
            submitData.append('pricePerHour', formData.pricePerHour);
            submitData.append('openingTime', formData.openingTime);
            submitData.append('closingTime', formData.closingTime);
            submitData.append('isActive', formData.isActive);

            // Add arrays as JSON strings
            submitData.append('sports', JSON.stringify(formData.sports));
            submitData.append('amenities', JSON.stringify(formData.amenities));

            // Add images
            formData.images.forEach((image, index) => {
                if (image instanceof File) {
                    submitData.append('images', image);
                }
            });

            if (selectedVenue) {
                await updateVenue(selectedVenue._id, submitData);
                success("Venue updated successfully");
            } else {
                await createVenue(submitData);
                success("Venue created successfully");
            }
            setShowModal(false);
            resetForm();
            loadVenues();
        } catch (err) {
            showError(err.response?.data?.message || "Operation failed");
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            address: "",
            city: "",
            state: "",
            locationLink: "",
            sports: [],
            amenities: [],
            images: [],
            pricePerHour: "",
            openingTime: "08:00",
            closingTime: "22:00",
            manager: "",
            isActive: true
        });
        setImagePreviews([]);
    };

    const openCreateModal = () => {
        setSelectedVenue(null);
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (venue) => {
        setSelectedVenue(venue);
        setFormData({
            name: venue.name || "",
            description: venue.description || "",
            address: venue.address || "",
            city: venue.city || "",
            state: venue.state || "",
            locationLink: venue.locationLink || "",
            sports: venue.sports || [],
            amenities: venue.amenities || [],
            images: venue.images || [],
            pricePerHour: venue.pricePerHour || "",
            openingTime: venue.openingTime || "08:00",
            closingTime: venue.closingTime || "22:00",
            manager: venue.manager?._id || "",
            isActive: venue.isActive !== undefined ? venue.isActive : true
        });
        setImagePreviews(venue.images || []);
        setShowModal(true);
    };

    const openDeleteConfirm = (venue) => {
        setSelectedVenue(venue);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await deleteVenue(selectedVenue._id);
            success("Venue deleted successfully");
            setShowDeleteConfirm(false);
            loadVenues();
        } catch (err) {
            showError("Failed to delete venue");
        }
    };

    const handleApprove = async (venueId) => {
        try {
            await approveVenue(venueId);
            success("Venue approved successfully");
            loadVenues();
        } catch (err) {
            showError("Failed to approve venue");
        }
    };

    return (
        <DashboardLayout role="ADMIN" title="Manage Venues" description="System-side overview of all registered stadium venues.">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">All Venues</h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Venue
                    </button>
                </div>

                {loading ? <div className="p-10"><Loader /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-bold">Venue</th>
                                    <th className="px-6 py-4 font-bold">Location</th>
                                    <th className="px-6 py-4 font-bold text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {venues.map(v => (
                                    <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{v.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {[v.address, v.city, v.state].filter(Boolean).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${v.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {v.approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {!v.approved && (
                                                    <button
                                                        onClick={() => handleApprove(v._id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(v)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(v)}
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
                                {venues.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-gray-500">No Venues Found.</td></tr>}
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
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <form onSubmit={handleSubmit} className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {selectedVenue ? 'Edit Venue' : 'Create New Venue'}
                                </h3>

                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter venue name"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter venue description"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter full address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select State</option>
                                                {states.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                disabled={!formData.state}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                                            >
                                                <option value="">Select City</option>
                                                {cities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Link (Google Maps)</label>
                                            <input
                                                type="url"
                                                name="locationLink"
                                                value={formData.locationLink}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="https://maps.google.com/..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Users will be redirected to this link to view location</p>
                                        </div>
                                    </div>

                                    {/* Sports Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sports Offered *</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {SPORTS_OPTIONS.map(sport => (
                                                <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.sports.includes(sport)}
                                                        onChange={() => handleSports(sport)}
                                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{sport}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {AMENITIES_OPTIONS.map(amenity => (
                                                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.amenities.includes(amenity)}
                                                        onChange={() => handleAmenities(amenity)}
                                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{amenity}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Venue Images</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {imagePreviews.length > 0 && (
                                            <div className="mt-3 grid grid-cols-3 gap-3">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing and Timing */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour (₹) *</label>
                                            <input
                                                type="number"
                                                name="pricePerHour"
                                                value={formData.pricePerHour}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time *</label>
                                            <input
                                                type="time"
                                                name="openingTime"
                                                value={formData.openingTime}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time *</label>
                                            <input
                                                type="time"
                                                name="closingTime"
                                                value={formData.closingTime}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Active Status */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active Venue</label>
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
                                        disabled={submitLoading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitLoading ? 'Saving...' : (selectedVenue ? 'Update' : 'Create')}
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
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Venue</h3>
                                <p className="text-gray-500 mb-6">
                                    Are you sure you want to delete <span className="font-semibold">{selectedVenue?.name}</span>? This action cannot be undone.
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
