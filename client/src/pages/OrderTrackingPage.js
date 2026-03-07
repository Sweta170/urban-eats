import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosInstance";
import {
    CheckCircle,
    Clock,
    Navigation,
    Package,
    ArrowLeft,
    Sparkles,
    MapPin,
    ShieldCheck,
    ChevronRight
} from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function OrderTrackingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/order/${id}`);
                setOrder(res.data.data);
            } catch (err) {
                console.error("Failed to fetch order", err);
            }
            setLoading(false);
        };
        fetchOrder();

        // Socket.io Integration
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to tracking socket");
            socket.emit("joinOrderRange", id);
        });

        socket.on("orderStatusUpdate", (data) => {
            console.log("Real-time status update:", data);
            if (data.orderId === id) {
                setOrder(prev => ({ ...prev, status: data.status }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const steps = [
        { label: "Confirmed", status: ["Pending", "Processing", "Shipped", "Delivered"], icon: CheckCircle },
        { label: "Preparing", status: ["Processing", "Shipped", "Delivered"], icon: Clock },
        { label: "Dispatch", status: ["Shipped", "Delivered"], icon: Navigation },
        { label: "Arrived", status: ["Delivered"], icon: Package }
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-500">
            <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
            <h2 className="text-xl font-bold mb-4">No active trace for this ID</h2>
            <Link to="/orders" className="text-primary-600 font-black uppercase tracking-widest text-xs hover:underline">View History</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
                {/* Navigation */}
                <button
                    onClick={() => navigate('/orders')}
                    className="group mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 hover:text-primary-600 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to History
                </button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary-100 dark:border-primary-800/10">
                                <Sparkles className="w-3 h-3" /> Live Surveillance
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse outline outline-4 outline-green-500/10" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Active Pursuit</h1>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] font-mono mt-1">Trace ID: #{order._id.slice(-12)}</p>
                    </div>

                    <div className="bg-gray-900 dark:bg-dark-card px-8 py-5 rounded-3xl text-right shadow-xl shadow-primary-500/5 min-w-[200px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Estimated Arrival</p>
                        <p className="text-3xl font-black text-white italic tracking-tight">12:45 <span className="text-sm font-medium opacity-50 ml-1">PM</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Progress Board */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-dark-card p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 relative">
                                {/* Connector Line */}
                                <div className="hidden sm:block absolute top-[18px] left-4 right-4 h-0.5 bg-gray-50 dark:bg-gray-800" />

                                {steps.map((step, idx) => {
                                    const isDone = step.status.includes(order.status);
                                    const isCurrent = order.status === step.status[0];

                                    return (
                                        <div key={idx} className="flex sm:flex-col items-center gap-4 sm:gap-4 relative z-10 w-full sm:w-auto">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 shadow-sm ${isDone ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' :
                                                'bg-gray-50 dark:bg-gray-800 text-gray-300'
                                                }`}>
                                                <step.icon className={`w-5 h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                                            </div>
                                            <div className="text-left sm:text-center">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-gray-900 dark:text-white' : 'text-gray-300'}`}>{step.label}</p>
                                                {isCurrent && <p className="text-[8px] font-bold text-primary-600 uppercase tracking-tight -mt-0.5">In Progress</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Destination Target</h3>
                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed max-w-sm">{order.shippingAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Compact Order Digest */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 dark:bg-dark-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Package Contents</h2>
                            <div className="space-y-4 mb-8">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-primary-600 bg-primary-600/5 px-1.5 py-0.5 rounded">x{item.quantity}</span>
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors capitalize">{item.food?.name || "Premium Item"}</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payload</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">₹{order.total}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 text-gray-300 grayscale opacity-40">
                                    <ShieldCheck className="w-5 h-5" />
                                    <p className="text-[8px] font-black uppercase tracking-widest leading-relaxed">Antigravity Secure Payload Assurance v2.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
