
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setTokens } from "../utils/auth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import GlassCard from "../components/common/GlassCard";
import { LogIn } from "lucide-react";

export default function LoginPage() {
	const [form, setForm] = useState({ email: "", password: "" });
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
		if (!form.email || !form.password) {
			setError("All fields are required");
			return;
		}
		setIsLoading(true);
		try {
			const res = await axios.post("http://localhost:5000/api/auth/login", form);
			if (res.data.success) {
				setSuccess("Login successful!");
				setTokens({
					accessToken: res.data.data.accessToken,
					refreshToken: res.data.data.refreshToken,
				});
				setTimeout(() => navigate("/"), 1000);
			} else {
				setError(res.data.message || "Login failed");
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
				<div className="hidden md:block">
					<img
						src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000"
						alt="Food Login"
						className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
					/>
				</div>

				{/* Right Side - Form */}
				<GlassCard className="p-8 w-full max-w-md mx-auto">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
						<p className="text-gray-500 dark:text-gray-400">Sign in to continue your food journey</p>
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
							label="Email Address"
							type="email"
							name="email"
							placeholder="you@example.com"
							value={form.email}
							onChange={handleChange}
							required
						/>

						<div className="space-y-1">
							<Input
								label="Password"
								type="password"
								name="password"
								placeholder="••••••••"
								value={form.password}
								onChange={handleChange}
								required
							/>
							<div className="flex justify-end">
								<Link
									to="/forgot-password"
									className="text-sm text-primary-600 hover:text-primary-700 font-medium"
								>
									Forgot password?
								</Link>
							</div>
						</div>

						<Button
							type="submit"
							fullWidth
							size="lg"
							disabled={isLoading}
						>
							{isLoading ? "Signing in..." : (
								<span className="flex items-center gap-2">
									Sign In <LogIn className="w-5 h-5" />
								</span>
							)}
						</Button>
					</form>

					<div className="mt-8 text-center text-gray-600 dark:text-gray-400">
						Don't have an account?{" "}
						<Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
							Create Account
						</Link>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
