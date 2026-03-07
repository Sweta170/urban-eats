import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, Heart } from "lucide-react";
import { getAccessToken, logout, getUserRole } from "../../utils/auth";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!getAccessToken();
    const userRole = getUserRole();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-primary-500 p-1.5 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                            UrbanEats
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`font-medium transition-colors ${isActive("/") ? "text-primary-600" : "text-gray-600 dark:text-gray-300 hover:text-primary-500"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/menu"
                            className={`font-medium transition-colors ${isActive("/menu") ? "text-primary-600" : "text-gray-600 dark:text-gray-300 hover:text-primary-500"
                                }`}
                        >
                            Menu
                        </Link>

                        {isLoggedIn ? (
                            <>
                                {userRole === 'restaurant' && (
                                    <Link
                                        to="/restaurant-dashboard"
                                        className={`font-black uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/10 transition-colors ${isActive("/restaurant-dashboard") ? "text-primary-600 ring-1 ring-primary-500/20" : "text-primary-600 hover:bg-primary-100"
                                            }`}
                                    >
                                        Partner Central
                                    </Link>
                                )}
                                <Link
                                    to="/orders"
                                    className={`font-medium transition-colors ${isActive("/orders") ? "text-primary-600" : "text-gray-600 dark:text-gray-300 hover:text-primary-500"
                                        }`}
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/favorites"
                                    className={`font-medium transition-colors ${isActive("/favorites") ? "text-primary-600" : "text-gray-600 dark:text-gray-300 hover:text-primary-500"
                                        }`}
                                >
                                    Favorites
                                </Link>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                                <div className="flex items-center gap-4">
                                    <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                        <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                        {/* Badge could go here */}
                                    </Link>
                                    <Link to="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                        <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-500/30"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card">
                    <div className="px-4 py-3 space-y-3">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/menu"
                            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Menu
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/orders"
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/favorites"
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Favorites
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Cart
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    className="block text-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-center px-3 py-2 rounded-lg text-base font-medium bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
