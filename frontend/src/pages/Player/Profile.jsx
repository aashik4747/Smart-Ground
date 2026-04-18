import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getProfile, updateProfile } from "../../services/userService";
import { useNotification } from "../../context/NotificationContext";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getProfile();
                if (!res.data) {
                    throw new Error("No profile data received from server");
                }
                setProfile(res.data);
                setFormData(res.data);
                if (!res.data.turfId) {
                    setIsEditing(true);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                console.error("Error response:", error.response);
                console.error("Error message:", error.message);
                console.error("Error status:", error.response?.status);
                addNotification("Failed to load profile.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [addNotification]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImageFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.turfId || formData.turfId.trim() === "") {
                addNotification("A unique Turf ID is required to use the platform.", "error");
                return;
            }

            const data = new FormData();
            data.append("name", formData.name || "");
            data.append("phone", formData.phone || "");
            if (formData.turfId) data.append("turfId", formData.turfId);
            if (formData.skillLevel) data.append("skillLevel", formData.skillLevel);

            if (formData.preferredSport) {
                data.append("preferredSport", JSON.stringify(formData.preferredSport));
            }

            if (formData.profileImageFile) {
                data.append("profileImage", formData.profileImageFile);
            }

            const res = await updateProfile(data);
            console.log("Profile update response:", res.data);
            setProfile(res.data);
            setIsEditing(false);
            setImagePreview(null);
            addNotification("Profile updated successfully!", "success");
        } catch (error) {
            console.error("Failed to update profile:", error);

            // Send error to backend for debugging
            try {
                fetch('/api/debug/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: error.message,
                        stack: error.stack,
                        response: error.response?.data,
                        status: error.response?.status
                    })
                });
            } catch (e) { console.error("Failed to log error", e); }

            const msg = error.response?.data?.message || "Failed to update profile. Check console.";
            addNotification(msg, "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <Footer />
        </div>
    );

    if (!profile) return null;

    const getProfileImageUrl = () => {
        console.log("Image preview:", imagePreview);
        console.log("Profile image:", profile.profileImage);
        if (imagePreview) return imagePreview;
        if (profile.profileImage) return profile.profileImage;
        return null;
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <Navbar />

            <div className="flex-grow">
                {/* Profile Header */}
                <div className="bg-indigo-600 pb-32 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-white/5 blur-[120px]"></div>
                        <div className="absolute bottom-[0%] -left-[10%] w-[40%] h-[80%] rounded-full bg-blue-300/10 blur-[100px]"></div>
                    </div>
                    
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
                            <div className="relative group">
                                <div className="h-28 w-28 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-2xl ring-4 ring-white/20 bg-white overflow-hidden">
                                    {getProfileImageUrl() ? (
                                        <img
                                            src={getProfileImageUrl()}
                                            alt={profile.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        profile.name?.charAt(0).toUpperCase()
                                    )}
                                </div>

                                {isEditing && (
                                    <label htmlFor="profile-image-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        <input
                                            id="profile-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="text-center md:text-left text-white">
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{profile.name}</h1>
                                {profile.turfId && <p className="text-indigo-200 mt-1.5 font-mono font-medium text-lg">{profile.turfId}</p>}
                                <p className="text-indigo-100 mt-2 flex items-center justify-center md:justify-start font-medium tracking-wide">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    {profile.email}
                                </p>
                                <div className="mt-5 flex gap-3 justify-center md:justify-start">
                                    <span className="px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                                        {profile.role}
                                    </span>
                                    <span className="px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold uppercase tracking-widest flex items-center backdrop-blur-sm">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Stats & Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 animate-fade-in-up">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Activity Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl transition-all hover:bg-indigo-100">
                                    <div>
                                        <p className="text-indigo-700 font-extrabold text-2xl">{profile.mvpAwards || 0}</p>
                                        <p className="text-indigo-600/70 text-[11px] font-bold uppercase tracking-widest mt-1">MVP Awards</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-indigo-200/50 flex items-center justify-center text-indigo-700 text-lg">
                                        🏅
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl transition-all hover:bg-purple-100">
                                    <div>
                                        <p className="text-purple-700 font-extrabold text-2xl">{profile.reliabilityScore || 100}</p>
                                        <p className="text-purple-600/70 text-[11px] font-bold uppercase tracking-widest mt-1">Reliability Score</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-purple-200/50 flex items-center justify-center text-purple-700 text-lg">
                                        ⭐
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-pink-50 rounded-2xl transition-all hover:bg-pink-100">
                                    <div>
                                        <p className="text-pink-700 font-extrabold text-xl">{profile.skillLevel || "Beginner"}</p>
                                        <p className="text-pink-600/70 text-[11px] font-bold uppercase tracking-widest mt-1">Skill Rating</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-pink-200/50 flex items-center justify-center text-pink-700 text-lg">
                                        🔥
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-7 animate-fade-in-up animation-delay-200 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">Account Details</h3>
                                </div>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${isEditing
                                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                        }`}
                                >
                                    {isEditing ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Save Profile
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            Edit Profile
                                        </>
                                    )}
                                </button>
                            </div>

                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Turf ID</label>
                                        <input
                                            type="text"
                                            name="turfId"
                                            placeholder="@striker22"
                                            value={formData.turfId || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Skill Level</label>
                                        <select
                                            name="skillLevel"
                                            value={formData.skillLevel || "Beginner"}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-800 font-medium"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-3">Preferred Sports</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            {[
                                                { name: "Cricket", icon: "🏏" },
                                                { name: "Football", icon: "⚽" },
                                                { name: "Badminton", icon: "🏸" },
                                                { name: "Tennis", icon: "🎾" },
                                                { name: "Basketball", icon: "🏀" }
                                            ].map((sport) => {
                                                const isSelected = formData.preferredSport?.includes(sport.name);
                                                return (
                                                    <div
                                                        key={sport.name}
                                                        onClick={() => {
                                                            let updatedSports = formData.preferredSport || [];
                                                            if (isSelected) {
                                                                updatedSports = updatedSports.filter((s) => s !== sport.name);
                                                            } else {
                                                                updatedSports = [...updatedSports, sport.name];
                                                            }
                                                            setFormData({ ...formData, preferredSport: updatedSports });
                                                        }}
                                                        className={`
                                                            cursor-pointer relative overflow-hidden group p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-1.5
                                                            ${isSelected
                                                                ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/20"
                                                                : "border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-600"
                                                            }
                                                        `}
                                                    >
                                                        <div className="text-xl">{sport.icon}</div>
                                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                                                            {sport.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 mt-2">
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address (Read-only)</label>
                                        <input
                                            type="text"
                                            value={formData.email || ""}
                                            disabled
                                            className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-100/50 text-slate-400 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-2">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                                        </div>
                                        <p className="mt-1.5 text-base font-semibold text-slate-800">{profile.name}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                        </div>
                                        <p className="mt-1.5 text-base font-semibold text-slate-800">{profile.email}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                                        </div>
                                        <p className="mt-1.5 text-base font-semibold text-slate-800">{profile.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Turf ID</p>
                                        </div>
                                        <p className="mt-1.5 text-base font-semibold text-slate-800">{profile.turfId || "Not Set"}</p>
                                    </div>
                                    <div className="md:col-span-2 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preferred Sports</p>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {profile.preferredSport && profile.preferredSport.length > 0
                                                ? profile.preferredSport.map(sport => (
                                                    <span key={sport} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-200">
                                                        {sport}
                                                    </span>
                                                ))
                                                : <span className="text-slate-500 italic text-sm">No preferences set</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
