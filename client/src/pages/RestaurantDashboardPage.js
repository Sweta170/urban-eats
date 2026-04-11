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
    Edit2,
    Trash2
} from "lucide-react";

export default function RestaurantDashboardPage() {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchData = async () => {
        try {
            const [statsRes, menuRes] = await Promise.all([
                axios.get("/restaurant/stats"),
                axios.get("/restaurant/menu")
            ]);
            if (statsRes.data.success) setStats(statsRes.data.data);
            if (menuRes.data.success) setMenuItems(menuRes.data.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
        setLoading(false);
    };

    const fetchOrders = async () => {
        setOrderLoading(true);
        try {
            const res = await axios.get("/restaurant/orders");
            if (res.data.success) setOrders(res.data.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }
        setOrderLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab]);

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const res = await axios.put(`/order/${orderId}/status`, { status });
            if (res.data.success) {
                fetchOrders(); // Refresh list
                fetchData(); // Refresh stats
            }
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    const navItems = [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "menu", label: "Menu Items", icon: <ShoppingBag className="w-4 h-4" /> },
        { id: "orders", label: "Live Orders", icon: <Clock className="w-4 h-4" /> },
        { id: "settings", label: "Store Settings", icon: <Settings className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFF] dark:bg-dark-bg flex transition-colors duration-500">

            {/* ── Sidebar ── */}
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
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${
                                activeTab === item.id
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl"
                                    : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
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

            {/* ── Main Canvas ── */}
            <main className="flex-grow p-6 lg:p-12 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                    <>
                        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase mb-2">
                                    Performance <span className="text-primary-600">Metric</span>
                                </h1>
                                <p className="text-sm font-bold text-gray-400 tracking-tight italic">Analyzing real-time restaurant performance and menu efficiency.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="px-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:shadow-lg transition-all">
                                    Export Report
                                </button>
                                <button
                                    onClick={() => setActiveTab("menu")}
                                    className="px-6 py-3.5 bg-primary-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> New Dish
                                </button>
                            </div>
                        </header>

                        {/* Stats */}
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
                                        <span className={`text-[10px] font-black text-${stat.color === "primary" ? "green" : "blue"}-500 bg-${stat.color === "primary" ? "green" : "blue"}-50 dark:bg-gray-800 px-2 py-1 rounded-lg uppercase tracking-widest`}>{stat.trend}</span>
                                    </div>
                                    <div className="absolute bottom-[-10%] right-[-5%] w-24 h-24 bg-gray-50 dark:bg-gray-800/10 rounded-full blur-2xl group-hover:bg-primary-500/5 transition-colors"></div>
                                </div>
                            ))}
                        </div>

                        {/* Recent items + store health */}
                        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white italic">Recent Catalog Items</h3>
                                        <button onClick={() => setActiveTab("menu")} className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">
                                            Manage All
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {menuItems.length === 0 ? (
                                            <p className="text-sm text-gray-400 text-center py-8">
                                                No menu items yet.{" "}
                                                <button onClick={() => setActiveTab("menu")} className="text-primary-600 font-bold underline">
                                                    Add your first dish →
                                                </button>
                                            </p>
                                        ) : menuItems.slice(0, 4).map((item, idx) => (
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
                                                <button onClick={() => setActiveTab("menu")} className="p-2 text-gray-300 hover:text-primary-600 transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="bg-gray-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-gray-900 relative overflow-hidden group shadow-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Store Health</p>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full border-4 border-primary-500 border-t-white dark:border-t-gray-900 flex items-center justify-center">
                                            <span className="text-xl font-black">94%</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tighter">Excellent</p>
                                            <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-1">Order Accuracy</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-white/10 dark:bg-gray-900/10 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white/20 transition-all">
                                        Review Feedback
                                    </button>
                                    <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ── MENU ITEMS ── */}
                {activeTab === "menu" && (
                    <MenuItemsPanel menuItems={menuItems} setMenuItems={setMenuItems} />
                )}

                {/* ── LIVE ORDERS ── */}
                {activeTab === "orders" && (
                    <div className="relative z-10">
                        <header className="mb-10">
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">
                                Live <span className="text-primary-600">Orders</span>
                            </h1>
                            <p className="text-sm text-gray-400 font-bold tracking-tight">Active requests requiring preparation or delivery coordination.</p>
                        </header>

                        {orderLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-3 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                                <Clock className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No active orders right now</p>
                                <p className="text-xs text-gray-300 mt-2 italic">New orders will show up here automatically.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {orders.map((order, idx) => (
                                    <div key={order._id || idx} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID: {order._id.slice(-8)}</span>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-blue-50 text-blue-600 animate-pulse'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                                                        <span className="text-[10px] font-black text-primary-600">{item.quantity}X</span>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.food?.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {order.user?.name}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {order.status === 'Placed' && (
                                                <button 
                                                    onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')}
                                                    className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 dark:hover:bg-primary-600 dark:hover:text-white transition-all shadow-lg"
                                                >
                                                    Start Preparing
                                                </button>
                                            )}
                                            {order.status === 'Preparing' && (
                                                <button 
                                                    onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                                                    className="px-6 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-500/20"
                                                >
                                                    Ship Order
                                                </button>
                                            )}
                                            {order.status === 'Out for Delivery' && (
                                                <button 
                                                    onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                                                    className="px-6 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}
                                                className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── STORE SETTINGS ── */}
                {activeTab === "settings" && (
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-4">
                            Store <span className="text-primary-600">Settings</span>
                        </h1>
                        <p className="text-sm text-gray-400 font-bold mb-12">Manage your restaurant profile and preferences.</p>
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                            <Settings className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Settings coming soon</p>
                            <p className="text-xs text-gray-300 mt-2 italic">Customize your opening hours and delivery zones.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

/* ─────────── Menu Items Panel ─────────── */
function MenuItemsPanel({ menuItems, setMenuItems }) {
    const [form, setForm] = useState({ name: "", price: "", category: "", description: "" });
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.category) {
            setError("Name, price and category are required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const res = await axios.post("/restaurant/menu", form);
            if (res.data.success) {
                setMenuItems(prev => [...prev, res.data.data]);
                setForm({ name: "", price: "", category: "", description: "" });
                setShowForm(false);
            } else {
                setError(res.data.message || "Failed to add item");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error");
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this dish?")) return;
        try {
            await axios.delete(`/restaurant/menu/${id}`);
            setMenuItems(prev => prev.filter(i => i._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const filtered = menuItems.filter(i =>
        i.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative z-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase mb-2">
                        Menu <span className="text-primary-600">Items</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-400 italic">
                        {menuItems.length} item{menuItems.length !== 1 ? "s" : ""} in your catalog
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(s => !s)}
                    className="px-6 py-3.5 bg-primary-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {showForm ? "Cancel" : "Add New Dish"}
                </button>
            </header>

            {/* Add Item Form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 mb-8 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">New Dish Details</h3>
                    {error && (
                        <p className="text-red-500 text-xs font-bold mb-4 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
                    )}
                    <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
                        {[
                            { name: "name", label: "Dish Name", placeholder: "e.g. Butter Chicken" },
                            { name: "price", label: "Price (₹)", placeholder: "e.g. 250", type: "number" },
                            { name: "category", label: "Category", placeholder: "e.g. Main Course" },
                            { name: "description", label: "Description (optional)", placeholder: "Short description..." },
                        ].map(f => (
                            <div key={f.name}>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">{f.label}</label>
                                <input
                                    name={f.name}
                                    type={f.type || "text"}
                                    placeholder={f.placeholder}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        ))}
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3.5 bg-primary-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Dish"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                />
            </div>

            {/* Items List */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                            {search ? "No items match your search" : "No menu items yet"}
                        </p>
                        {!search && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-xs text-primary-600 font-bold underline"
                            >
                                Add your first dish →
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {filtered.map((item, idx) => (
                            <div
                                key={item._id || idx}
                                className="flex items-center gap-5 px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <img
                                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{item.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
                                    {item.description && (
                                        <p className="text-[10px] text-gray-300 mt-1 truncate">{item.description}</p>
                                    )}
                                </div>
                                <p className="text-sm font-black text-gray-900 dark:text-white italic shrink-0">₹{item.price}</p>
                                <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/10 px-3 py-1 rounded-lg uppercase tracking-widest shrink-0">
                                    Active
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
