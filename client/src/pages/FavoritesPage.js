import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosInstance";
import FoodCard from "../components/common/FoodCard";
import { Heart, ArrowLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

export default function FavoritesPage() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await axios.get((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/favorite`));
            if (res.data.success) {
                setFavorites(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch favorites", err);
        }
        setLoading(false);
    };

    const handleToggleFavorite = async (foodId) => {
        try {
            const res = await axios.post((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/favorite/toggle`), { foodId });
            if (res.data.success) {
                setFavorites(favorites.filter(f => f._id !== foodId));
            }
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const handleAddToCart = async (foodId) => {
        setAddingId(foodId);
        try {
            await axios.post("/cart", { foodId, quantity: 1 });
            setSuccessMsg("Items added!");
            setTimeout(() => setSuccessMsg(""), 1200);
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
        setAddingId("");
    };

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

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Your Favorites</h1>
                        <p className="text-sm text-gray-400 font-medium">{favorites.length} items saved</p>
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Heart className="w-8 h-8 text-gray-100 dark:text-gray-900" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No saves yet</h2>
                        <p className="text-xs text-gray-500 mb-8 max-w-sm mx-auto">Collect the dishes you love by tapping the heart icon on the menu.</p>
                        <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/10 active:scale-95">
                            Browse Menu <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((food) => (
                            <div key={food._id} className="animate-in fade-in zoom-in-95 duration-500">
                                <FoodCard
                                    food={food}
                                    onAdd={handleAddToCart}
                                    isAdding={addingId === food._id}
                                    onClick={() => navigate(`/food/${food._id}`)}
                                    isFavorite={true}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Notification Toast */}
            {successMsg && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <div className="bg-primary-600 text-white px-5 py-3 rounded-xl shadow-lg border-2 border-white dark:border-dark-card flex items-center gap-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{successMsg}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
