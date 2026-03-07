import React, { useState } from "react";
import axios from "../utils/axiosInstance";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/auth/change-password", { oldPassword, newPassword });
      if (res.data.success) {
        setMessage("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        setError(res.data.message || "Failed to change password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded shadow mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Current password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
