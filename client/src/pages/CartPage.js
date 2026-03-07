import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { getAccessToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag, ArrowLeft, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchCart = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/cart");
        setCart(res.data.data || []);
      } catch (err) {
        setError("Failed to load your cart");
      }
      setLoading(false);
    };
    fetchCart();
  }, [token, navigate]);

  const updateQuantity = async (foodId, quantity) => {
    setUpdating(true);
    try {
      await axios.post(
        "/cart",
        { foodId, quantity }
      );
      setCart((prev) =>
        prev.map((item) =>
          item.food._id === foodId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError("Failed to update item count");
    }
    setUpdating(false);
  };

  const removeItem = async (foodId) => {
    setUpdating(true);
    try {
      await axios.delete("/cart", { data: { foodId } });
      setCart((prev) => prev.filter((item) => item.food._id !== foodId));
    } catch (err) {
      setError("Failed to remove item");
    }
    setUpdating(false);
  };

  const total = cart.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);

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
          className="group mb-8 flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 hover:text-primary-600 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Your Order Bag</h1>
            <p className="text-sm text-gray-400 font-medium">{cart.length} items collected</p>
          </div>
          {cart.length > 0 && (
            <div className="flex items-center gap-1.5 text-primary-600 font-bold bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl border border-primary-100 dark:border-primary-800/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-widest">Free Delivery Activated</span>
            </div>
          )}
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl font-bold text-xs mb-8 border border-red-100">{error}</div>}

        {!loading && cart.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-8 h-8 text-gray-200" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Bag is empty</h2>
            <p className="text-xs text-gray-500 mb-8 max-w-xs mx-auto">Explore our culinary range and find something to satisfy your cravings.</p>
            <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/10 active:scale-95">
              Explore Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.food._id} className="group bg-white dark:bg-dark-card p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center">
                  <div className="w-full sm:w-24 aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border-2 border-white dark:border-gray-800 shadow-sm shrink-0">
                    <img
                      src={item.food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"}
                      alt={item.food.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">{item.food.category}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.food.name}</h3>
                    <p className="text-primary-600 font-bold text-sm">₹{item.food.price}</p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-full p-1 border border-gray-100 dark:border-gray-700">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90"
                        onClick={() => updateQuantity(item.food._id, Math.max(1, item.quantity - 1))}
                        disabled={updating || item.quantity <= 1}
                      ><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-black w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-600 text-white shadow-md shadow-primary-500/10 active:scale-90"
                        onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                        disabled={updating}
                      ><Plus className="w-3 h-3" /></button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-lg font-black text-gray-900 dark:text-white">₹{item.food.price * item.quantity}</span>
                      </div>
                      <button
                        className="p-2.5 bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        onClick={() => removeItem(item.food._id)}
                        disabled={updating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Summary Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-gray-900 dark:bg-dark-card p-8 rounded-3xl text-white shadow-xl shadow-primary-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/10 rounded-full blur-2xl" />

                <h2 className="text-lg font-bold mb-8 flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-primary-500" /> Bill Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-xs font-medium text-white/50">
                    <span>Menu Total</span>
                    <span className="text-white">₹{total}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-white/50">
                    <span>Deliveries</span>
                    <span className="text-green-500 font-bold uppercase tracking-widest text-[9px]">Free</span>
                  </div>
                  <div className="pt-5 border-t border-white/10 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">Amount Due</span>
                    <span className="text-3xl font-black italic">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-primary-700 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <span>Checkout Now</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 flex items-center gap-3 text-white/20">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                    Secure checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
