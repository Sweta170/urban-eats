import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import {
    Plus,
    Search,
    LayoutDashboard,
    ShoppingBag,
    Settings,
    TrendingUp,
    Users,
    Clock,
    ChevronRight,
    MoreVertical,
    Edit2,
    Trash2
} from "lucide-react";

export default function RestaurantDashboardPage() {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, menuRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/restaurant/stats"),
                    axios.get("http://localhost:5000/api/restaurant/menu")
                ]);
                if (statsRes.data.success) setStats(statsRes.data.data);
                if (menuRes.data.success) setMenuItems(menuRes.data.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFF] dark:bg-dark-bg flex transition-colors duration-500">
            {/* Sidebar Overlay for Mobile could go here */}

            {/* Control Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 sticky top-16 h-[calc(100vh-64px)] py-8 px-6 shrink-0 z-20">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-tight text-gray-900 dark:text-white uppercase">Control Hub</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Restaurant Partner</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
                        { id: "menu", label: "Menu Items", icon: <ShoppingBag className="w-4 h-4" /> },
                        { id: "orders", label: "Live Orders", icon: <Clock className="w-4 h-4" /> },
                        { id: "settings", label: "Store settings", icon: <Settings className="w-4 h-4" /> },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${activeTab === item.id
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl"
                                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                            {item.icon}
                            {item.label}
                            {activeTab === item.id && <ChevronRight className="ml-auto w-3 h-3 opacity-50" />}
                        </button>
                    ))}
                </nav>

                <div className="mt-8 bg-orange-50 dark:bg-orange-900/10 p-5 rounded-3xl border border-orange-100 dark:border-orange-900/20 relative overflow-hidden">
                    <p className="text-[10px] font-black text-orange-600 uppercase mb-2 relative z-10">Commission Rate</p>
                    <p className="text-2xl font-black text-orange-900 dark:text-orange-200 relative z-10">4.5%</p>
                    <div className="absolute right-[-10%] bottom-[-20%] w-24 h-24 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
                </div>
            </aside>

            {/* Main Dashboard Canvas */}
            <main className="flex-grow p-6 lg:p-12 relative overflow-hidden">
                {/* Ambient background glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase mb-2">
                            Performance <span className="text-primary-600">Metric</span>
                        </h1>
                        <p className="text-sm font-bold text-gray-400 tracking-tight italic">Analyzing real-time restaurant performance and menu efficiency.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:shadow-lg transition-all">Export Report</button>
                        <button className="px-6 py-3.5 bg-primary-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-2">
                            <Plus className="w-4 h-4" /> New Dish
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                    {[
                        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, trend: "+12.5%", color: "primary", icon: <TrendingUp className="w-5 h-5" /> },
                        { label: "Total Orders", value: stats.totalOrders, trend: "+8.2%", color: "secondary", icon: <ShoppingBag className="w-5 h-5" /> },
                        { label: "Active Items", value: menuItems.length, trend: "Stable", color: "blue", icon: <Users className="w-5 h-5" /> },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative group overflow-hidden transition-all hover:shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/10 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">{stat.value}</h3>
                                <span className={`text-[10px] font-black text-${stat.color === 'primary' ? 'green' : 'blue'}-500 bg-${stat.color === 'primary' ? 'green' : 'blue'}-50 dark:bg-gray-800 px-2 py-1 rounded-lg uppercase tracking-widest`}>{stat.trend}</span>
                            </div>
                            {/* Micro decoration */}
                            <div className="absolute bottom-[-10%] right-[-5%] w-24 h-24 bg-gray-50 dark:bg-gray-800/10 rounded-full blur-2xl group-hover:bg-primary-500/5 transition-colors"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom grid: Recent orders and Menu summary */}
                <div className="grid lg:grid-cols-3 gap-8 relative z-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white italic">Recent Catalog Items</h3>
                                <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">Manage All</button>
                            </div>

                            <div className="space-y-4">
                                {menuItems.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
                                        <img src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform" />
                                        <div className="flex-1">
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900 dark:text-white italic">₹{item.price}</p>
                                            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-0.5">In Stock</p>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-gray-900 relative overflow-hidden group shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Store Health</p>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full border-4 border-primary-500 border-t-white dark:border-t-gray-900 flex items-center justify-center relative">
                                    <span className="text-xl font-black">94%</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-tighter">Excellent</p>
                                    <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-1">Order Accuracy</p>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-white/10 dark:bg-gray-900/10 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white/20 transition-all">Review Feedback</button>
                            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
