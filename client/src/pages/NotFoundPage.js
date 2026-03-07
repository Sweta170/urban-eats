import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">404</h1>
        <p className="mb-6 text-lg">Page Not Found</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Go Home</Link>
      </div>
    </div>
  );
}
