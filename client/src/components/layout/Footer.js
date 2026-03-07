import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
                            UrbanEats
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            Delivering happiness to your doorstep. Experience the best food from top-rated restaurants in your city.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">Home</Link></li>
                            <li><Link to="/menu" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">Menu</Link></li>
                            <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    © {new Date().getFullYear()} UrbanEats. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
