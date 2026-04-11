import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    Clock, 
    Ticket, 
    CreditCard,
    ArrowLeft,
    Sparkles,
    Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/common/GlassCard";

export default function WalletPage() {
    const [walletData, setWalletData] = useState({ balance: 0, transactions: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/wallet");
                if (res.data.success) {
                    setWalletData(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch wallet data", err);
            }
            setLoading(false);
        };
        fetchWallet();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050510]">
            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050510] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                    </button>
                    <div className="text-right">
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Urban <span className="text-primary-600">Wallet.</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Secure Rewards System</p>
                    </div>
                </div>

                {/* Main Balance Card */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary-600/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    <GlassCard className="p-8 md:p-12 relative overflow-hidden border-white/10">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Wallet className="w-32 h-32 text-white" />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-600/20 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-primary-500" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Available Balance</span>
                            </div>
                            
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl md:text-7xl font-black italic tracking-tighter">₹{walletData.balance.toFixed(2)}</span>
                                <span className="text-sm font-black text-primary-500 uppercase tracking-widest">Urban Credits</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-8">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Cashback Rate</p>
                                    <p className="text-lg font-black italic text-green-500">5.0%</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Security</p>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-primary-500" />
                                        <p className="text-xs font-black italic">Encrypted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Transactions Segment */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Transaction History</h2>
                        <Clock className="w-4 h-4 text-gray-600" />
                    </div>

                    <div className="space-y-3">
                        {walletData.transactions.length > 0 ? (
                            walletData.transactions.map((tx, idx) => (
                                <GlassCard 
                                    key={tx._id} 
                                    className="p-5 flex items-center justify-between border-white/5 hover:border-white/10 transition-all group"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${
                                            tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {tx.type === 'credit' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tighter group-hover:text-primary-500 transition-colors">{tx.description}</p>
                                            <p className="text-[10px] font-bold text-gray-500 mt-0.5">
                                                {new Date(tx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black italic ${
                                            tx.type === 'credit' ? 'text-green-500' : 'text-white'
                                        }`}>
                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                        </p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{tx.status}</p>
                                    </div>
                                </GlassCard>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
                                <p className="text-sm font-black uppercase tracking-widest text-gray-500">No transactions yet</p>
                                <p className="text-[10px] font-bold text-gray-600 mt-2">Earn cashback on every order!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="p-6 bg-primary-600/5 border border-primary-600/10 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-primary-600/20 rounded-full">
                        <CreditCard className="w-4 h-4 text-primary-500" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                        Use your Urban Wallet balance to pay for orders. Cashback is automatically credited once your order is confirmed.
                    </p>
                </div>

            </div>
        </div>
    );
}
