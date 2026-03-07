import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, LogOut, Package, Star, Clock, ChevronRight, Settings, Heart, Bell } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me");
                setUser(res.data.data);
            } catch (err) {
                navigate("/login");
            }
            setLoading(false);
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-500">
            <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500">
            {/* Compact Profile Hero */}
            <div className="relative h-[220px] bg-gradient-to-br from-primary-600 to-primary-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-24 -mb-24" />

                <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
                            {user?.name ? (
                                <span className="text-3xl font-black">{user.name[0].toUpperCase()}</span>
                            ) : (
                                <User className="w-10 h-10" />
                            )}
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl font-bold tracking-tight mb-1">{user?.name}</h1>
                            <div className="flex items-center gap-4 text-white/70 text-xs font-medium">
                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full capitalize"><Shield className="w-3.5 h-3.5" />{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-6 pb-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Panel: Loyalty & Stats */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-50 dark:bg-yellow-900/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loyalty Points</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-gray-900 dark:text-white">{user?.loyaltyPoints || 0}</span>
                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">XP</span>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-4 leading-relaxed font-medium capitalize">
                                Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl shadow-primary-500/5">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6 font-mono">Quick Access</h3>
                            <nav className="space-y-4">
                                <button onClick={() => navigate('/orders')} className="w-full flex items-center justify-between group">
                                    <span className="flex items-center gap-3 text-sm font-bold"><Package className="w-4 h-4 text-primary-500" /> My Orders</span>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary-500 transition-colors" />
                                </button>
                                <button onClick={() => navigate('/favorites')} className="w-full flex items-center justify-between group">
                                    <span className="flex items-center gap-3 text-sm font-bold"><Heart className="w-4 h-4 text-primary-500" /> Favorites</span>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary-500 transition-colors" />
                                </button>
                                <div className="h-px bg-white/5 my-2" />
                                <button className="w-full flex items-center justify-between group opacity-50 cursor-not-allowed">
                                    <span className="flex items-center gap-3 text-sm font-bold"><Bell className="w-4 h-4" /> Notifications</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Right Panel: Settings & Logout */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold">Account Settings</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all hover:border-primary-600/10">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Display Name</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{user?.name}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all hover:border-primary-600/10">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email ID</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.email}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-all hover:border-primary-600/10">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Joined</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary-600/5 border border-primary-600/10 transition-all">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-600 mb-1">Status</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Active Account</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Sensitive Data</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Logged in via Antigravity Secure Auth</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-red-500 hover:text-white active:scale-95"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Disconnect</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
