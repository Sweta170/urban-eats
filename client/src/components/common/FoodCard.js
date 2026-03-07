import React from "react";
import { Star, Heart, Plus } from "lucide-react";

export default function FoodCard({ food, onAdd, isAdding, onClick, isFavorite, onToggleFavorite }) {
    return (
        <div className="group bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-500/30 flex flex-col h-full shadow-sm">
            {/* Optimized Image Area */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img
                    src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    onClick={onClick}
                />

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(food._id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 ${isFavorite ? "bg-red-500 text-white shadow-sm" : "bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500"
                        }`}
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
            </div>

            {/* Tight Content Section */}
            <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-0.5 gap-2">
                    <h3
                        className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors uppercase tracking-tight"
                        onClick={onClick}
                    >
                        {food.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-primary-600 dark:text-primary-400 text-[10px] font-black shrink-0">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{food.averageRating ? food.averageRating.toFixed(1) : "5.0"}</span>
                    </div>
                </div>

                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                    {food.category}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 dark:text-gray-600">Price</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">₹</span>
                            <span className="text-base font-black text-gray-900 dark:text-white leading-none">{food.price}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onAdd(food._id)}
                        disabled={isAdding}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center transition-all ${isAdding
                                ? "bg-gray-100 text-gray-300"
                                : "bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-lg shadow-primary-500/20"
                            }`}
                    >
                        {isAdding ? (
                            <div className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                                <Plus className="w-3 h-3 stroke-[3px]" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
