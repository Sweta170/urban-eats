import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (sessionId && orderId) {
      verifyPayment();
    } else {
      setVerifying(false);
    }
  }, [sessionId, orderId]);

  const verifyPayment = async () => {
    try {
      const res = await axios.post('/payment/verify', { sessionId, orderId });
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Verification failed", err);
    }
    setVerifying(false);
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-6" />
        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Verifying Payment</h1>
        <p className="text-gray-400 font-bold mt-2">Please do not close this window...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-card p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-primary-500/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-primary-400" />

        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          {success ? "Payment Successful!" : "Order Confirmed!"}
        </h1>

        <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 leading-relaxed">
          Thank you for choosing UrbanEats. Your delicious meal is being prepared with care and will be on its way shortly.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate(`/order-tracking/${orderId}`)}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Track Order Live</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/menu')}
            className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:text-primary-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-primary-500/50">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Order ID: #{orderId?.slice(-6).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
