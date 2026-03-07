import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Cpu,
    Brain,
    Zap,
    Globe,
    ShieldCheck,
    Sparkles,
    Search,
    Layout,
    MousePointer2,
    ChefHat,
    Beef,
    Fish,
    Apple,
    Coffee,
    Cake
} from "lucide-react";
import axios from "../utils/axiosInstance";

export default function LandingPage() {
    const [popularFoods, setPopularFoods] = useState([]);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const orbitRef = useRef(null);

    const featuredItems = [
        { _id: 'f1', name: "Chef's Galaxy Burger", imageUrl: "/assets/chef-burger.png", price: 299, isDelicious: true },
        { _id: 'f2', name: "Nebula Pizza Slice", imageUrl: "/assets/nebula-pizza.png", price: 189, isDelicious: true },
        { _id: 'f3', name: "Zen Fusion Sushi", imageUrl: "/assets/zen-sushi.png", price: 450, isDelicious: true }
    ];

    const allDisplayItems = [...featuredItems, ...popularFoods].slice(0, 8);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/food/popular");
                if (res.data.success) {
                    setPopularFoods(res.data.data.slice(0, 6));
                }
            } catch (err) {
                console.error("Failed to fetch popular foods", err);
            }
        };
        fetchPopular();

        const interval = setInterval(() => {
            if (!isDragging) {
                setRotation(prev => prev + 0.2);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [isDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const delta = (e.clientX - startX) * 0.5;
        setRotation(prev => prev + delta);
        setStartX(e.clientX);
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div
            className="relative min-h-screen bg-[#050510] text-white overflow-hidden perspective-1000 select-none pb-20"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Neural Particles Background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-primary-500 rounded-full animate-neural-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random() * 0.4
                        }}
                    />
                ))}
            </div>

            {/* Glowing Aura Shapes */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-600/10 rounded-full blur-[180px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse delay-700" />

            {/* Main Interactive Hub */}
            <div className="relative z-10 flex flex-col items-center w-full">
                <section className="min-h-screen flex flex-col items-center justify-start pt-32 pb-20 p-4">
                    <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-16">

                        <div className="space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-4">
                                <Sparkles className="w-3 h-3 text-primary-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Best Food in Town • Smart Delivery</span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none mb-4">
                                FIND YOUR <span className="text-primary-600 not-italic">MEAL.</span>
                            </h1>
                            <p className="text-lg text-gray-400 font-bold leading-tight max-w-lg mx-auto">
                                Spin the wheel to find what you're craving. Our smart app knows exactly
                                <span className="text-white"> what you'll love </span> today.
                            </p>
                        </div>

                        {/* Circular Orbital Menu */}
                        <div
                            ref={orbitRef}
                            className="relative w-[300px] h-[300px] md:w-[650px] md:h-[650px] flex items-center justify-center preserve-3d cursor-grab active:cursor-grabbing"
                            onMouseDown={handleMouseDown}
                        >
                            {/* Central Neural Core */}
                            <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                                <div className="w-32 h-32 md:w-64 md:h-64 bg-primary-600/10 rounded-full border border-primary-500/20 flex items-center justify-center relative">
                                    <div className="absolute inset-0 neural-core-glow animate-pulse" />
                                    <div className="absolute inset-[-30px] border border-white/5 rounded-full animate-spin-slow" />
                                    <div className="absolute inset-[-70px] border border-white/5 rounded-full animate-spin-reverse-slow opacity-50" />
                                    <div className="relative text-center space-y-2">
                                        <Cpu className="w-8 h-8 md:w-16 md:h-16 text-primary-500 mx-auto animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">FOOD HUB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Orbiting Food Items */}
                            {allDisplayItems.map((food, idx) => {
                                const angle = (idx / allDisplayItems.length) * 360 + rotation;
                                const radius = window.innerWidth < 768 ? 140 : 320;
                                const x = Math.cos((angle * Math.PI) / 180) * radius;
                                const y = Math.sin((angle * Math.PI) / 180) * radius;
                                const z = Math.sin((angle * Math.PI) / 180) * 120;

                                return (
                                    <Link
                                        key={food._id}
                                        to={food.isDelicious ? "/menu" : `/food/${food._id}`}
                                        className="absolute p-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl transition-all duration-300 hover:bg-primary-600/90 group z-30 hover-glow"
                                        style={{
                                            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${angle}deg)`,
                                            width: window.innerWidth < 768 ? '110px' : '220px'
                                        }}
                                    >
                                        <div className="relative">
                                            {food.isDelicious && (
                                                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-primary-600 text-[8px] font-black px-2 py-0.5 rounded-full z-40 animate-pulse uppercase tracking-widest whitespace-nowrap">
                                                    Delicious Choice
                                                </div>
                                            )}
                                            <div
                                                className="aspect-square rounded-[2.5rem] overflow-hidden mb-3 border border-white/5 group-hover:border-white/30 transition-all shadow-inner"
                                                style={{ transform: `rotateY(-${angle}deg)` }}
                                            >
                                                <img
                                                    src={food.imageUrl}
                                                    alt={food.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <MousePointer2 className="w-8 h-8 text-white animate-bounce" />
                                                </div>
                                            </div>
                                            <div className="text-center px-1 py-1" style={{ transform: `rotateY(-${angle}deg)` }}>
                                                <p className="text-[11px] font-black uppercase tracking-tighter truncate group-hover:text-white mb-0.5">{food.name}</p>
                                                <p className="text-[10px] font-black italic text-primary-500 group-hover:text-white">₹{food.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Sub-Orbital Analytics */}
                <section className="w-full max-w-7xl mx-auto px-4 pb-32">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-reveal-up">
                        {[
                            { label: "Your Favorites", icon: <Brain />, val: "Tailored for You", delay: "0s" },
                            { label: "Top Rated", icon: <Globe />, val: "Loved by Many", delay: "0.1s" },
                            { label: "Fast Delivery", icon: <Zap />, val: "22-min Average", delay: "0.2s" },
                            { label: "Safe & Clean", icon: <ShieldCheck />, val: "Trusted Kitchens", delay: "0.3s" }
                        ].map((node, i) => (
                            <div
                                key={i}
                                className="glass-card p-10 rounded-[2.5rem] group hover:bg-primary-600/10 transition-all border-white/5 text-center"
                                style={{ animationDelay: node.delay }}
                            >
                                <div className="text-primary-500 mb-4 flex justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">{node.icon}</div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{node.label}</p>
                                <p className="text-lg font-black italic text-white group-hover:text-primary-500 transition-colors">{node.val}</p>
                            </div>
                        ))}
                    </div>

                </section>

                {/* Intelligence Story: About UrbanEats */}
                <section className="w-full max-w-5xl mx-auto px-4 py-32 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8 animate-reveal-right">
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                                OUR <br />
                                <span className="text-primary-600 not-italic">STORY.</span>
                            </h2>
                            <p className="text-gray-400 font-bold leading-relaxed text-lg">
                                UrbanEats is more than just a delivery app. We use smart technology to bring you the freshest food from the best local kitchens. We don't just deliver; we make sure your meal is exactly what you wanted.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Smart Cooking: We know your favorite spice & flavors.",
                                    "Express Tracking: Watch your food come to you live.",
                                    "Happy Rewards: Points that save you money daily."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group cursor-default">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full group-hover:w-8 transition-all duration-500" />
                                        <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative animate-reveal-up" style={{ animationDelay: '0.4s' }}>
                            <div className="absolute inset-0 bg-primary-600/20 blur-[100px] animate-pulse" />
                            <div className="glass-card p-12 rounded-[3rem] border-white/10 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-700 animate-float">
                                <Sparkles className="absolute top-8 right-8 w-8 h-8 text-primary-500 opacity-20 group-hover:rotate-12 transition-transform" />
                                <h3 className="text-2xl font-black italic mb-6">"Good food is the foundation of genuine happiness."</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">— UrbanEats Team</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Neural Reach: Stats & Engagement */}
                <section className="w-full bg-white/5 py-40">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-24 space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">OUR COMMUNITY.</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-xs">Trusted by thousands across the city</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { label: "Happy Customers", val: "50k+", desc: "Verified Users", delay: "0s" },
                                { label: "Restaurant Partners", val: "1.2k", desc: "Top Local Chefs", delay: "0.2s" },
                                { label: "Orders Delivered", val: "15M+", desc: "A Community Favorite", delay: "0.4s" },
                                { label: "Happy Reviews", val: "98.9%", desc: "Customer Satisfaction", delay: "0.6s" }
                            ].map((stat, i) => (
                                <div key={stat.label} className="text-center space-y-2 group animate-reveal-up" style={{ animationDelay: stat.delay }}>
                                    <p className="text-5xl md:text-7xl font-black italic tracking-tighter text-white/20 group-hover:text-primary-600/80 group-hover:scale-110 transition-all duration-700">{stat.val}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 group-hover:tracking-[0.5em] transition-all">{stat.label}</p>
                                    <p className="text-xs font-bold text-gray-600 group-hover:text-gray-400">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Flavor Nebula: Category Explorer */}
                <section className="w-full py-40 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-900/5 animate-pulse-soft" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-600/5 to-transparent" />

                    {/* Nebula Scan Line */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="w-40 h-full bg-primary-600/10 blur-[100px] animate-nebula-scan" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative">
                        <div className="text-center mb-32 space-y-4 animate-reveal-up">
                            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                                FLAVOR <br />
                                <span className="text-primary-600 not-italic">NEBULA.</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-xs">Explore taste horizons in high-definition</p>
                        </div>

                        <div className="relative h-[600px] flex items-center justify-center">
                            {[
                                { name: "Pizza", icon: <ChefHat />, color: "from-orange-500", img: "/assets/nebula-pizza.png", x: -200, y: -100, size: "xl" },
                                { name: "Burgers", icon: <Beef />, color: "from-primary-600", img: "/assets/chef-burger.png", x: 250, y: -150, size: "lg" },
                                { name: "Sushi", icon: <Fish />, color: "from-red-500", img: "/assets/zen-sushi.png", x: -300, y: 150, size: "lg" },
                                { name: "Healthy", icon: <Apple />, color: "from-green-500", img: "/assets/zen-salad.png", x: 100, y: 200, size: "md" },
                                { name: "Coffee", icon: <Coffee />, color: "from-amber-800", img: "/assets/nebula-coffee.png", x: 0, y: -250, size: "sm" },
                                { name: "Desserts", icon: <Cake />, color: "from-pink-500", img: "/assets/nebula-dessert.png", x: 350, y: 50, size: "md" }
                            ].map((node, i) => (
                                <div
                                    key={i}
                                    className={`absolute animate-nebula-drift hover:z-50 group`}
                                    style={{
                                        left: `calc(50% + ${node.x}px)`,
                                        top: `calc(50% + ${node.y}px)`,
                                        animationDelay: `${i * 0.5}s`
                                    }}
                                >
                                    <div className="relative cursor-pointer transition-all duration-700 hover:scale-150">
                                        {/* Glow Layer */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${node.color} to-transparent blur-2xl opacity-20 group-hover:opacity-60 transition-opacity rounded-full`} />

                                        {/* Main Node */}
                                        <div className="relative glass-card p-6 md:p-8 rounded-full border-white/10 group-hover:border-primary-500/50 transition-all nebula-node-glow">
                                            <div className="text-primary-500 group-hover:scale-110 transition-transform">
                                                {React.cloneElement(node.icon, { className: node.size === 'xl' ? 'w-12 h-12' : 'w-8 h-8' })}
                                            </div>

                                            {/* Hover Visuals Card */}
                                            <div className="absolute left-1/2 -bottom-40 -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                                                <div className="glass-card p-4 rounded-3xl border-primary-500/30 overflow-hidden shadow-2xl backdrop-blur-2xl">
                                                    <div className="aspect-video rounded-2xl overflow-hidden mb-3">
                                                        <img src={node.img} alt={node.name} className="w-full h-full object-cover scale-125 group-hover:scale-100 transition-transform duration-1000" />
                                                    </div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-primary-500 mb-1">{node.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-tight">Syncing with <br /><span className="text-white">Flavor Profile 0{i + 1}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-primary-500 transition-colors">{node.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Echoes of Flavor: Quotes */}
                <section className="w-full max-w-5xl mx-auto px-4 py-40">
                    <div className="text-center space-y-16">
                        <div className="relative inline-block">
                            <div className="absolute -top-12 -left-12 text-9xl text-white/5 italic font-black">"</div>
                            <h2 className="text-3xl md:text-5xl font-black italic text-white/80 leading-tight">
                                Fresh food is just <br />
                                <span className="text-white">one click away.</span>
                            </h2>
                        </div>
                        <div className="flex justify-center gap-12">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">Fresh Ingredients</p>
                                <p className="text-xs font-bold text-gray-400">Pure Quality</p>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10" />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">Smart Technology</p>
                                <p className="text-xs font-bold text-gray-400">Always On Time</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-40 text-center">
                    <Link
                        to="/menu"
                        className="group relative px-20 py-8 bg-primary-600 text-white rounded-full font-black text-sm uppercase tracking-[0.5em] overflow-hidden shadow-[0_0_60px_rgba(234,88,12,0.4)] hover:shadow-[0_0_80px_rgba(234,88,12,0.6)] transition-all inline-block"
                    >
                        <span className="relative z-10 flex items-center gap-6">Explore the Menu <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" /></span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Link>
                </section>
            </div>

            <div className="fixed bottom-10 left-10 space-y-1 pointer-events-none opacity-40">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">Live & Ready</p>
                <div className="w-32 h-[1px] bg-primary-500/30" />
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.5em]">UrbanEats • Smarter Food Delivery</p>
            </div>

            <div className="fixed bottom-10 right-10 flex gap-6 pointer-events-auto">
                <button className="flex flex-col items-center gap-2 group">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl group-hover:bg-primary-600 transition-all">
                        <Search className="w-5 h-5" />
                    </div>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl group-hover:bg-primary-600 transition-all">
                        <Layout className="w-5 h-5" />
                    </div>
                </button>
            </div>
        </div>
    );
}
