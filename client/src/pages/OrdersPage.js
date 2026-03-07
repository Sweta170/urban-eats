import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { getAccessToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { Package, Calendar, Clock, ChevronRight, ArrowLeft, Search, Filter, ShoppingBag, Sparkles, MapPin } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/order");
        setOrders(res.data.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o =>
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-500">
      <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate('/menu')}
          className="group mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 hover:text-primary-600 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Your Activity</h1>
            <p className="text-sm text-gray-400 font-medium">Tracking {orders.length} previous experiences</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by ID or Status..."
                className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary-600/20 focus:ring-0 rounded-xl py-2.5 pl-10 text-xs font-medium dark:text-white transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Package className="w-8 h-8 text-gray-100" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history found</h2>
            <p className="text-xs text-gray-500 mb-8">When you place orders, they'll appear here for tracking and re-ordering.</p>
            <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/10 active:scale-95">
              Order Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/order-tracking/${order._id}`)}
                className="group bg-white dark:bg-dark-card p-4 sm:p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary-600/20 transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary-600 shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                  <Package className="w-6 h-6" />
                </div>

                <div className="flex-1 text-center sm:text-left overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 font-mono truncate">#{order._id.slice(-8)}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600 animate-pulse'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 dark:border-gray-800">
                  <div className="flex-1 sm:flex-none text-center sm:text-right px-4">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Value</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight italic">₹{order.totalAmount}</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-600/10 rounded-full transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
