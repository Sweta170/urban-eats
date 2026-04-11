import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import FoodCard from "../components/common/FoodCard";
import { Search, SlidersHorizontal, ChevronRight, Filter, ShoppingBag, Sparkles, LayoutGrid, Mic } from "lucide-react";
import { getAccessToken } from "../utils/auth";
import VoiceSearch from "../components/common/VoiceSearch";

export default function MenuPage() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [addingId, setAddingId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["Snacks", "Main Course", "Starter", "South Indian", "North Indian", "Chinese", "Rice", "Dessert", "Beverage"];
  const isLoggedIn = !!getAccessToken();

  useEffect(() => {
    fetchFoods();
    if (isLoggedIn) {
      fetchFavorites();
      fetchRecommended();
    }
  }, [keyword, selectedCategories, minPrice, maxPrice, minRating, sort, isLoggedIn]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append("keyword", keyword);
      if (selectedCategories.length > 0) queryParams.append("category", selectedCategories.join(','));
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (minRating) queryParams.append("minRating", minRating);
      if (sort) queryParams.append("sort", sort);

      const res = await axios.get("/food", { params: Object.fromEntries(queryParams) });
      setFoods(res.data.data || []);
    } catch (err) {
      setError("Failed to load collection");
    }
    setLoading(false);
  };

  const fetchRecommended = async () => {
    try {
      const res = await axios.get("/food/recommended");
      if (res.data.success) setRecommendedFoods(res.data.data);
    } catch (err) { }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("/favorite");
      if (res.data.success) setFavorites(res.data.data.map(f => f._id));
    } catch (err) { }
  };

  const handleToggleFavorite = async (foodId) => {
    if (!isLoggedIn) return navigate("/login");
    try {
      const res = await axios.post("/favorite/toggle", { foodId });
      if (res.data.success) {
        setFavorites(res.data.data.isFavorite ? [...favorites, foodId] : favorites.filter(id => id !== foodId));
      }
    } catch (err) { }
  };

  const handleAddToCart = async (foodId) => {
    setAddingId(foodId);
    try {
      await axios.post("/cart", { foodId, quantity: 1 });
      setSuccessMsg("Added!");
      setTimeout(() => setSuccessMsg(""), 1200);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
    setAddingId("");
  };

  return (
    <div className="min-h-screen bg-gray-50/20 dark:bg-dark-bg flex transition-colors duration-500">
      {/* Refined Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 sticky top-16 h-[calc(100vh-64px)] py-6 px-5 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <LayoutGrid className="w-5 h-5 text-primary-600" />
          <h2 className="text-sm font-black tracking-widest text-gray-900 dark:text-white uppercase">Menu</h2>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategories([])}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs font-black uppercase tracking-wider ${selectedCategories.length === 0
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
              : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            <span>All Items</span>
            {selectedCategories.length === 0 && <ChevronRight className="w-3 h-3" />}
          </button>

          <div className="py-2 px-4 flex items-center gap-2">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Categories</span>
            <div className="h-px bg-gray-50 dark:bg-gray-800 flex-1" />
          </div>

          {categories.map(cat => {
            const isActive = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategories(prev =>
                    isActive ? prev.filter(c => c !== cat) : [...prev, cat]
                  );
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs font-black uppercase tracking-wider ${isActive
                  ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 border border-primary-100 dark:border-primary-800/10 shadow-sm"
                  : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                <span>{cat}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
              </button>
            )
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
          <div className="bg-primary-600 p-4 rounded-xl relative overflow-hidden group shadow-lg shadow-primary-500/10">
            <p className="text-[9px] font-black uppercase tracking-widest text-primary-100 relative z-10 mb-1">PROMO</p>
            <p className="text-xs font-bold text-white relative z-10">Free delivery on every order over ₹500</p>
            <div className="absolute right-[-10%] bottom-[-20%] w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          </div>
        </div>
      </aside>

      {/* Structured Content Area */}
      <main className="flex-grow pt-10 px-4 sm:px-8 pb-10">
        <div className="max-w-[1280px] mx-auto">
          {/* Personalized Recommendations Row */}
          {isLoggedIn && recommendedFoods.length > 0 && selectedCategories.length === 0 && !keyword && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Curated for You</h2>
              </div>
              <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
                {recommendedFoods.map(food => (
                  <div key={food._id} className="min-w-[240px] max-w-[240px]">
                    <FoodCard
                      food={food}
                      onAdd={handleAddToCart}
                      isAdding={addingId === food._id}
                      onClick={() => navigate(`/food/${food._id}`)}
                      isFavorite={favorites.includes(food._id)}
                      onToggleFavorite={handleToggleFavorite}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contextual Utility Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                {selectedCategories.length === 0 ? "All Cuisine" : selectedCategories[0]}
                {selectedCategories.length > 1 && <span className="text-primary-600 ml-1">+{selectedCategories.length - 1}</span>}
                <span className="text-gray-200 dark:text-gray-800 font-bold ml-3">/</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg outline-none focus:ring-1 focus:ring-primary-600/20 w-full sm:w-56 text-sm font-bold shadow-sm"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
              <VoiceSearch onSearch={(text) => setKeyword(text)} />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-lg border transition-all ${showFilters
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400"
                  }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategories.length > 0 || minPrice || maxPrice || keyword) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategories(prev => prev.filter(c => c !== cat))}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                >
                  {cat} <span className="opacity-30">×</span>
                </button>
              ))}
              {keyword && (
                <button
                  onClick={() => setKeyword("")}
                  className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/10 text-[10px] font-black uppercase tracking-widest text-primary-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                >
                  "{keyword}" <span className="opacity-30">×</span>
                </button>
              )}
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                  className="px-3 py-1.5 bg-green-50 dark:bg-green-900/10 text-[10px] font-black uppercase tracking-widest text-green-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                >
                  ₹{minPrice || 0} - ₹{maxPrice || '∞'} <span className="opacity-30">×</span>
                </button>
              )}
              <button
                onClick={() => { setSelectedCategories([]); setKeyword(""); setMinPrice(""); setMaxPrice(""); }}
                className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-all"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Compact Filters Expansion */}
          {showFilters && (
            <div className="mb-8 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sort By</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['newest', 'price_asc', 'rating_desc'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${sort === s ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      {s.split('_')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Budget Limit</label>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={maxPrice || 2000}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between mt-3">
                    <span className="text-[10px] font-black text-gray-300 uppercase italic">Under ₹{maxPrice || 2000}</span>
                    <button
                      onClick={() => setMaxPrice("")}
                      className="text-[10px] font-black text-primary-600 uppercase tracking-widest"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <button onClick={() => { setSelectedCategories([]); setSort("newest"); setMinPrice(""); setMaxPrice(""); setKeyword(""); }} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Clear Filters</button>
              </div>
            </div>
          )}

          {/* Balanced Grid Display */}
          {loading ? (
            <div className="py-40 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary-50 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {foods.map((food) => (
                <div key={food._id} className="animate-in fade-in zoom-in-95 duration-500">
                  <FoodCard
                    food={food}
                    onAdd={handleAddToCart}
                    isAdding={addingId === food._id}
                    onClick={() => navigate(`/food/${food._id}`)}
                    isFavorite={favorites.includes(food._id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShoppingBag className="w-7 h-7 text-gray-300" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">No Matches</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Try adjusting your filters or category selection.</p>
              <button onClick={() => setSelectedCategories([])} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest">Browse Catalog</button>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Toast */}
      {successMsg && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-widest">{successMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
