
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setTokens } from "../utils/auth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import GlassCard from "../components/common/GlassCard";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post((`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/register`), form);
      if (res.data.success) {
        setSuccess("Registration successful! Redirecting...");
        setTokens({
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
        });
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(res.data.message || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Image/Branding */}
        <div className="hidden md:block order-2 md:order-1">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000"
            alt="Food Register"
            className="rounded-2xl shadow-2xl object-cover h-[550px] w-full"
          />
        </div>

        {/* Right Side - Form */}
        <GlassCard className="p-8 w-full max-w-md mx-auto order-1 md:order-2">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400">Join the UrbanEats community today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${form.role !== 'restaurant' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}
                onClick={() => setForm({ ...form, role: 'user' })}
              >
                Customer
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${form.role === 'restaurant' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}
                onClick={() => setForm({ ...form, role: 'restaurant' })}
              >
                Restaurant
              </button>
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : (
                <span className="flex items-center gap-2">
                  Sign Up <UserPlus className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
