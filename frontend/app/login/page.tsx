"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Attempting login with:", email);

    try {
      const userData = await login(email, password);
      console.log("Login successful, redirecting...");

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/");
      } else {
        router.push("/customer");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@admin.com"
                className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 transition-all shadow"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Register Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center p-12">
        <div className="text-white text-center space-y-6 max-w-md">
          <div className="inline-block mb-4">
            <img
              src="/logo.png"
              alt="Sleppy Store Logo"
              className="w-40 h-40 mx-auto"
            />
          </div>
          <h2 className="text-4xl font-bold">Welcome to Sleppy Store</h2>
          <div className="flex justify-center gap-6 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold">100+</div>
              <div className="text-blue-200 text-xs">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-blue-200 text-xs">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-blue-200 text-xs">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
