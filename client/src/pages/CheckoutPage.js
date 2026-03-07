import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { CreditCard, Banknote, MapPin, CheckCircle, ArrowLeft, ChevronRight, Lock, ShieldCheck, Ticket, Star, Sparkles, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Loyalty
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartAndUser();
  }, []);

  const fetchCartAndUser = async () => {
    try {
      const cartRes = await axios.get("/cart");
      const cartData = cartRes.data.data;
      setCart(cartData);
      setTotal(cartData.reduce((sum, item) => sum + item.food.price * item.quantity, 0));

      const userRes = await axios.get("http://localhost:5000/api/auth/me");
      setUserData(userRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await axios.post("/coupon/validate", {
        code: couponCode,
        cartTotal: total
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        setCouponDiscount(res.data.data.calculatedDiscount);
        setCouponError("");
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
    setCouponLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) return alert("Address required for delivery.");
    setLoading(true);
    try {
      const res = await axios.post("/order", {
        shippingAddress: address,
        paymentMethod: paymentMethod === "Online" ? "Card" : "Cash", // Map to existing enum
        promoCode: appliedCoupon ? appliedCoupon.code : null,
        useLoyaltyPoints: redeemPoints
      });
      if (res.data.success) {
        const orderId = res.data.data._id;
        if (paymentMethod === "Online") {
          const payRes = await axios.post("/payment/create-checkout-session", { orderId });
          if (payRes.data.success) {
            window.location.href = payRes.data.url;
            return;
          }
        }
        navigate(`/order-tracking/${orderId}`);
      }
    } catch (err) {
      alert("Checkout failed. Please retry.");
    }
    setLoading(false);
  };

  const loyaltyDiscount = redeemPoints ? Math.floor(userData.loyaltyPoints / 10) : 0;
  const finalTotal = total - couponDiscount - loyaltyDiscount;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate('/cart')}
          className="group mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 hover:text-primary-600 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Bag
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Secure Checkout</h1>
            <p className="text-sm text-gray-400 font-medium">Verify your details and finalize order</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-dark-bg flex items-center justify-center text-[10px] font-black shadow-sm ${i === 3 ? 'bg-primary-600 text-white animate-pulse' : 'bg-green-100 text-green-600'}`}>
                  {i === 3 ? '3' : <CheckCircle className="w-3 h-3" />}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 3</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 space-y-6">

            {/* Delivery Section */}
            <section className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">Delivery Location</h2>
              </div>
              <Input
                placeholder="Full street address, flat number..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border-gray-100 dark:border-gray-800 py-3 text-sm"
              />
            </section>

            {/* Loyalty Compact */}
            {userData && userData.loyaltyPoints >= 100 && (
              <section className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-3xl border-2 border-primary-600/10 shadow-sm overflow-hidden relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-500 rounded-xl">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Loyalty Points</h2>
                      <p className="text-xs text-gray-400 font-bold">{userData.loyaltyPoints} points available</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRedeemPoints(!redeemPoints)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${redeemPoints ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                  >
                    {redeemPoints ? "Applying Rewards" : "Use Points"}
                  </button>
                </div>
              </section>
            )}

            {/* Payment Section */}
            <section className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-50 dark:bg-green-900/10 text-green-600 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${paymentMethod === "COD"
                    ? "bg-primary-50 dark:bg-primary-900/10 border-primary-600"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"}`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === "COD" ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Cash on Delivery</p>
                </button>

                <button
                  onClick={() => setPaymentMethod("Online")}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${paymentMethod === "Online"
                    ? "bg-primary-50 dark:bg-primary-900/10 border-primary-600"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"}`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === "Online" ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Online Payment</p>
                </button>
              </div>
            </section>
          </div>

          {/* Compact Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-gray-50 dark:bg-dark-card p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h2 className="text-base font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary-600" /> Cart Summary
              </h2>

              <div className="space-y-3 mb-6 max-h-40 overflow-y-auto no-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium truncate w-32">
                      <span className="text-[10px] font-black text-gray-300 mr-2">{item.quantity}X</span>
                      {item.food.name}
                    </span>
                    <span className="font-bold">₹{item.food.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-3.5 h-3.5 text-primary-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apply Coupon</span>
                </div>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary-500/20 outline-none uppercase placeholder:normal-case"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                      <span className="text-xs font-black text-primary-700 uppercase tracking-tight">{appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponDiscount(0);
                        setCouponCode("");
                      }}
                      className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[9px] font-bold text-red-500 mt-2 px-1">{couponError}</p>}
                {appliedCoupon && <p className="text-[9px] font-bold text-green-600 mt-2 px-1 italic">Yuhu! You saved ₹{couponDiscount}</p>}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800 mb-8">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Items Total</span>
                  <span className="text-gray-900 dark:text-white">₹{total}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-black text-primary-600 uppercase tracking-widest">
                    <span>Coupon Savings</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                {redeemPoints && loyaltyDiscount > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-black text-green-600 uppercase tracking-widest">
                    <span>Loyalty Rewards</span>
                    <span>-₹{loyaltyDiscount}</span>
                  </div>
                )}
                <div className="pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-600 mb-1">Final Bill</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-primary-700 active:scale-95 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-3 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <span>Place Order Now</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-50" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-3 text-gray-300">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Checkout Link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
