import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { LayoutDashboard, Utensils, ClipboardList, Edit, Trash2, Plus, Save, X, Search } from "lucide-react";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("menu"); // menu | orders
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state for adding/editing food
    const [editingFood, setEditingFood] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        imageUrl: "",
        description: ""
    });

    useEffect(() => {
        if (activeTab === "menu") fetchFoods();
        else fetchOrders();
    }, [activeTab]);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/food");
            setFoods(res.data.data || []);
        } catch (err) {
            setError("Failed to load menu");
        }
        setLoading(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/order/all"); // Ensure this endpoint exists and is admin protected
            setOrders(res.data.data || []);
        } catch (err) {
            setError("Failed to load orders");
        }
        setLoading(false);
    };

    const handleDeleteFood = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/food/${id}`);
            setFoods(foods.filter(f => f._id !== id));
            setSuccess("Food deleted");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to delete food");
        }
    };

    const handleSaveFood = async (e) => {
        e.preventDefault();
        try {
            if (editingFood) {
                // Update
                const res = await axios.put(`/food/${editingFood._id}`, formData);
                setFoods(foods.map(f => f._id === editingFood._id ? res.data.data : f));
                setSuccess("Food updated");
            } else {
                // Create
                const res = await axios.post("/food", formData);
                setFoods([res.data.data, ...foods]);
                setSuccess("Food created");
            }
            setEditingFood(null);
            setShowForm(false);
            setFormData({ name: "", price: "", category: "", imageUrl: "", description: "" });
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to save food");
        }
    };

    const startEdit = (food) => {
        setEditingFood(food);
        setFormData({
            name: food.name,
            price: food.price,
            category: food.category,
            imageUrl: food.imageUrl || "",
            description: food.description || ""
        });
        setShowForm(true);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/order/${id}/status`, { status: newStatus });
            setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
            setSuccess("Order status updated");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="w-8 h-8 text-primary-600" /> Admin Dashboard
                    </h1>

                    {/* Tabs */}
                    <div className="flex bg-white dark:bg-dark-card p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <button
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "menu" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                            onClick={() => setActiveTab("menu")}
                        >
                            <span className="flex items-center gap-2"><Utensils className="w-4 h-4" /> Menu</span>
                        </button>
                        <button
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "orders" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Orders</span>
                        </button>
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2"><X className="w-5 h-5" /> {error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2"><Save className="w-5 h-5" /> {success}</div>}

                {activeTab === "menu" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu Items</h2>
                            <Button onClick={() => { setShowForm(!showForm); setEditingFood(null); setFormData({ name: "", price: "", category: "", imageUrl: "", description: "" }) }}>
                                {showForm ? "Cancel" : <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Food</span>}
                            </Button>
                        </div>

                        {/* Add/Edit Form */}
                        {showForm && (
                            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingFood ? "Edit Food Item" : "Add New Food Item"}</h3>
                                <form onSubmit={handleSaveFood} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Name"
                                        placeholder="Food Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Price"
                                            type="number"
                                            placeholder="Price"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Category"
                                            placeholder="Category"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Image URL"
                                            placeholder="https://example.com/image.jpg"
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea
                                            placeholder="Food Description"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            rows="3"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex gap-3 justify-end pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                        <Button type="submit">
                                            {editingFood ? "Update Food" : "Save Food"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Food List */}
                        {loading ? <div className="text-center py-10">Loading menu...</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {foods.map(food => (
                                    <div key={food._id} className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 hover:shadow-md transition-shadow group">
                                        <img src={food.imageUrl || "https://via.placeholder.com/100"} alt={food.name} className="w-24 h-24 object-cover rounded-xl" />
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{food.name}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{food.category}</p>
                                            <p className="font-bold text-primary-600 mb-auto">₹{food.price}</p>

                                            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(food)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteFood(food._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                        <th className="p-6 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Order ID</th>
                                        <th className="p-6 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">User</th>
                                        <th className="p-6 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Items</th>
                                        <th className="p-6 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Total</th>
                                        <th className="p-6 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Status</th>
                                        <th className="p-6 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-6 font-mono text-sm text-gray-600 dark:text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="p-6 font-medium text-gray-900 dark:text-white">{order.user?.name || "Unknown"}</td>
                                            <td className="p-6 text-sm text-gray-600 dark:text-gray-300">
                                                {order.items.map(i => (
                                                    <div key={i._id} className="whitespace-nowrap">{i.food?.name || "Item"} x {i.quantity}</div>
                                                ))}
                                            </td>
                                            <td className="p-6 font-bold text-gray-900 dark:text-white">₹{order.total}</td>
                                            <td className="p-6">
                                                <select
                                                    value={order.status || 'Order Placed'}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className={`
                                                        px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none cursor-pointer
                                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}
                                                    `}
                                                >
                                                    {['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                        <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-6 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {orders.length === 0 && <div className="p-12 text-center text-gray-500">No orders found.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
