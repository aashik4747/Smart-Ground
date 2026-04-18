import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllUsers, updateUser, deleteUser } from "../../services/adminService";
import { useSearchParams } from "react-router-dom";

export default function ManageUsers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialRole = searchParams.get("role") || "";
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState(initialRole);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [gamificationForm, setGamificationForm] = useState({ turfId: "", mvpAwards: 0, reliabilityScore: 100 });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers(filterRole);
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole]);

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setFilterRole(newRole);
        if (newRole) {
            setSearchParams({ role: newRole });
        } else {
            setSearchParams({});
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateUser(id, { status: newStatus });
            fetchUsers();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    const handleSaveGamification = async (e) => {
        e.preventDefault();
        try {
            await updateUser(editingUser._id, gamificationForm);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert("Failed to update gamification stats.");
        }
    };

    return (
        <DashboardLayout
            role="ADMIN"
            title="Manage Users"
            description="View and manage all users across different roles."
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 gap-4">
                    <h3 className="text-gray-900 font-bold text-lg">User Directory</h3>
                    <select
                        value={filterRole}
                        onChange={handleRoleChange}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 outline-none w-full md:w-auto focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Roles</option>
                        <option value="player">Players</option>
                        <option value="manager">Venue Managers</option>
                        <option value="stallOwner">Stall Owners</option>
                        <option value="pending">Pending</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>

                {error && <div className="p-4 text-red-500 bg-red-50">{error}</div>}

                {loading ? (
                    <div className="p-10"><Loader /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-semibold w-1/3">User</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                {user.turfId && <p className="text-xs font-mono text-indigo-500 mt-1">{user.turfId}</p>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${user.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                                                        user.role === 'manager' ? 'bg-teal-50 border-teal-200 text-teal-700' :
                                                            user.role === 'stallOwner' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                                                'bg-blue-50 border-blue-200 text-blue-700'
                                                    }`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                                                    className={`text-sm font-semibold border-0 rounded-lg py-1 px-2 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${user.status === 'active' ? 'text-green-600 bg-green-50 hover:bg-green-100' :
                                                            user.status === 'suspended' ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' :
                                                                'text-red-600 bg-red-50 hover:bg-red-100'
                                                        }`}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="banned">Banned</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {user.role === 'player' && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(user);
                                                            setGamificationForm({
                                                                turfId: user.turfId || "",
                                                                mvpAwards: user.mvpAwards || 0,
                                                                reliabilityScore: user.reliabilityScore || 100
                                                            });
                                                        }}
                                                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                                                        title="Gamification Governance"
                                                    >
                                                        🎮
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Gamification Governance Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Player Governance</h2>
                            <p className="text-sm text-gray-500">Modify stats for {editingUser.name}</p>
                        </div>
                        <form onSubmit={handleSaveGamification} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Turf ID</label>
                                <input
                                    type="text"
                                    value={gamificationForm.turfId}
                                    onChange={e => setGamificationForm({ ...gamificationForm, turfId: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">MVP Awards</label>
                                <input
                                    type="number"
                                    value={gamificationForm.mvpAwards}
                                    onChange={e => setGamificationForm({ ...gamificationForm, mvpAwards: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Reliability Score (0-100)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={gamificationForm.reliabilityScore}
                                    onChange={e => setGamificationForm({ ...gamificationForm, reliabilityScore: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Override</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
