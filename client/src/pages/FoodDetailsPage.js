import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { getAccessToken } from "../utils/auth";
import SuggestedPairings from "../components/common/SuggestedPairings";
import { ArrowLeft, Star, ShoppingBag, Send, Heart, ChevronRight, Check, Plus, Minus, Sparkles, Clock, ShieldCheck } from "lucide-react";

export default function FoodDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    // Review form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [allFavorites, setAllFavorites] = useState([]);


    const isAuthenticated = !!getAccessToken();

    useEffect(() => {
        fetchFoodDetails();
    }, [id]);

    const fetchFoodDetails = async () => {
        setLoading(true);
        try {
            const allFoods = await axios.get((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/food`));
            const foundFood = allFoods.data.data.find(f => f._id === id);
            setFood(foundFood);

            // Fetch reviews
            const reviewRes = await axios.get(`http://localhost:5000/api/review/${id}`);
            setReviews(reviewRes.data.data);

            // Check favorite status
            if (isAuthenticated) {
                const favRes = await axios.get((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/favorite`));
                if (favRes.data.success) {
                    const favIds = favRes.data.data.map(f => f._id);
                    setAllFavorites(favIds);
                    setIsFavorite(favIds.includes(id));
                }
            }
        } catch (err) {
            setError("Failed to load details");
        }
        setLoading(false);
    };

    const handleToggleFavorite = async (targetId = id) => {
        if (!isAuthenticated) return navigate("/login");
        try {
            const res = await axios.post((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/favorite/toggle`), { foodId: targetId });
            if (res.data.success) {
                const isNowFavorite = res.data.data.isFavorite;
                if (targetId === id) setIsFavorite(isNowFavorite);
                setAllFavorites(prev => isNowFavorite ? [...prev, targetId] : prev.filter(fid => fid !== targetId));
            }
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const handleAddToCart = async (targetId = id, targetQty = quantity) => {
        if (!isAuthenticated) return navigate("/login");
        setAdding(targetId);
        try {
            await axios.post("/cart", { foodId: targetId, quantity: targetQty });
            setAdding(false);
            setSuccessMsg("Added to cart!");
            setTimeout(() => setSuccessMsg(""), 2000);
        } catch (err) {
            setAdding(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return navigate("/login");
        if (!comment.trim()) return setReviewError("Please write something...");

        setSubmitting(true);
        setReviewError("");
        try {
            const res = await axios.post((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/review`), {
                foodId: id,
                rating,
                comment
            });
            if (res.data.success) {
                fetchFoodDetails();
                setComment("");
                setRating(5);
                setSuccessMsg("Review posted!");
                setTimeout(() => setSuccessMsg(""), 2000);
            }
        } catch (err) {
            setReviewError(err.response?.data?.message || "Failed to submit review");
        }
        setSubmitting(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-500">
            <div className="w-8 h-8 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!food) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-8">
            <h2 className="text-xl font-bold mb-4">Item Not Found</h2>
            <Link to="/menu" className="text-primary-600 font-bold hover:underline">Back to Menu</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 pb-16">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-primary-50/40 to-transparent dark:from-primary-900/5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 hover:text-primary-600 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Menu
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Visual Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl shadow-primary-500/5 border-4 border-white dark:border-dark-card group">
                            <img
                                src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"}
                                alt={food.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Floating Favorite Button */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`absolute top-4 right-4 p-3 rounded-xl backdrop-blur-md shadow-lg transition-all active:scale-90 ${isFavorite ? "bg-red-500 text-white" : "bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500"
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                            </button>

                            <div className="absolute left-6 bottom-6 px-4 py-1.5 bg-gray-900/70 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
                                {food.category}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col pt-2">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider rounded-lg">
                                    <Sparkles className="w-3 h-3" /> Most Loved
                                </span>
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-wider rounded-lg">
                                    <Clock className="w-3 h-3" /> 20-30 min
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
                                {food.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-lg border border-yellow-100/50 dark:border-yellow-900/20">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{food.averageRating ? food.averageRating.toFixed(1) : "5.0"}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-400">
                                    {food.ratingCount || 12} Reviews
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 dark:bg-dark-card p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8 relative overflow-hidden">
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10">
                                {food.description || "Our signature " + food.name + " is prepared with fresh ingredients, balanced spices, and a touch of our chef's magic."}
                            </p>
                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-xl" />
                        </div>

                        <div className="space-y-6 mt-auto">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Price</p>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-primary-600 text-lg font-black">₹</span>
                                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{food.price}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-full p-1.5 border border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-gray-500 transition-all active:scale-90"
                                    ><Minus className="w-3.5 h-3.5" /></button>
                                    <span className="text-base font-black w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/10 active:scale-90"
                                    ><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-base transition-all hover:bg-primary-700 shadow-lg shadow-primary-500/10 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {adding ? (
                                    <div className="animate-spin h-5 w-5 border-3 border-current border-t-transparent rounded-full"></div>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add to Order Bag • ₹{food.price * quantity}</span>
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure</span>
                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-500" /> Express</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Pairings (New Advanced Feature) */}
                <SuggestedPairings 
                    foodId={id} 
                    onAdd={(fid) => handleAddToCart(fid === id ? 1 : 1)} // Simplified for now
                    isAddingId={adding ? id : ""} 
                    favorites={allFavorites} 
                    onToggleFavorite={handleToggleFavorite} 
                />

                {/* Reviews Section */}
                <div className="mt-20">
                    <div className="flex items-baseline gap-3 mb-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Guest Feedback</h2>
                        <div className="h-0.5 flex-1 bg-gray-50 dark:bg-gray-800" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Review Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                                <h3 className="text-base font-bold mb-6">Rate this Item</h3>

                                <form onSubmit={handleSubmitReview} className="space-y-6">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setRating(s)}
                                                className={`w-9 h-9 rounded-lg transition-all ${rating >= s ? "bg-yellow-50 text-yellow-500" : "bg-gray-50 text-gray-200"}`}
                                            >
                                                <Star className={`w-4 h-4 mx-auto ${rating >= s ? "fill-current" : ""}`} />
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        placeholder="Write your feedback..."
                                        className="w-full bg-gray-50 dark:bg-gray-800/30 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary-600/10 min-h-[100px] border border-transparent"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    />

                                    {reviewError && <p className="text-[10px] font-bold text-red-500">{reviewError}</p>}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        {submitting ? "Posting..." : "Post Review"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="lg:col-span-2 space-y-4">
                            {reviews.length === 0 ? (
                                <div className="py-12 text-center bg-gray-50/30 dark:bg-gray-900/10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No reviews yet</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:border-primary-600/10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-xs font-bold text-primary-600">
                                                        {review.user?.name ? review.user.name[0].toUpperCase() : "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{review.user?.name || "Anonymous"}</p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-[10px] font-black">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed italic">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {successMsg && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <div className="bg-primary-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold">{successMsg}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
