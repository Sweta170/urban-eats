import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text font-sans">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
