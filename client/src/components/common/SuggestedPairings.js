import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import FoodCard from './FoodCard';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuggestedPairings({ foodId, onAdd, isAddingId, favorites, onToggleFavorite }) {
    const [pairings, setPairings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPairings = async () => {
            try {
                const res = await axios.get(`/food/${foodId}/pairings`);
                if (res.data.success) setPairings(res.data.data);
            } catch (err) {
                console.error("Failed to fetch pairings", err);
            }
            setLoading(false);
        };
        if (foodId) fetchPairings();
    }, [foodId]);

    if (loading || pairings.length === 0) return null;

    return (
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/10 text-orange-600 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Perfect Pairings</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended with this item</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pairings.map(food => (
                    <FoodCard
                        key={food._id}
                        food={food}
                        onAdd={onAdd}
                        isAdding={isAddingId === food._id}
                        onClick={() => navigate(`/food/${food._id}`)}
                        isFavorite={favorites?.includes(food._id)}
                        onToggleFavorite={onToggleFavorite}
                        compact={true}
                    />
                ))}
            </div>
        </div>
    );
}
