"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [user, router, isLoading]);

  const fetchStats = async () => {
    try {
      // Fetch products
      const productsRes = await api.get("/products");
      // Response is { products: [...], pagination: {...} }
      const productsData = productsRes.data.products || [];
      const productCount = Array.isArray(productsData)
        ? productsData.length
        : productsRes.data.pagination?.total || 0;

      // Fetch orders
      const ordersRes = await api.get("/orders");
      const ordersData = ordersRes.data.orders || ordersRes.data.data || [];
      const orderCount = Array.isArray(ordersData) ? ordersData.length : 0;
      const pendingCount = Array.isArray(ordersData)
        ? ordersData.filter((o: any) => o.status === "pending").length
        : 0;

      // Fetch users
      let userCount = 0;
      try {
        const usersRes = await api.get("/users");
        // Response is { data: [...], pagination: {...} }
        const usersData = usersRes.data.data || [];
        userCount = Array.isArray(usersData)
          ? usersData.length
          : usersRes.data.pagination?.total || 0;
      } catch (err) {
        console.warn("Could not fetch users:", err);
        userCount = 0; // Will show 0 if endpoint fails
      }

      console.log("Dashboard Stats:", {
        productCount,
        orderCount,
        userCount,
        pendingCount,
      });

      setStats({
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        pendingOrders: pendingCount,
      });

      // Generate chart data for last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        // Simulate data based on current stats (in real app, fetch from API with date filter)
        const dailyOrders = Math.floor(Math.random() * (orderCount + 5));
        const dailyRevenue = dailyOrders * 50000; // Average 50k per order

        last7Days.push({
          day: dayName,
          orders: dailyOrders,
          revenue: dailyRevenue,
        });
      }
      setChartData(last7Days);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen shadow-sm z-10 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-200">
            <img src="/logo.png" alt="Sleppy Store" className="w-10 h-10" />
            <div>
              <div className="font-bold text-lg text-gray-900">
                Sleppy Store
              </div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="bg-blue-50 text-blue-600 rounded-lg px-4 py-3 font-medium text-sm flex items-center space-x-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </div>
            <button
              onClick={() => router.push("/admin/users")}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 text-sm font-medium flex items-center space-x-3"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Users</span>
            </button>
            <button
              onClick={() => router.push("/admin/products")}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 text-sm font-medium flex items-center space-x-3"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Products</span>
            </button>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 text-sm font-medium flex items-center space-x-3"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Orders</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, {user?.fullName}
              </p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm">
              Generate Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Products
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📦</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalProducts}
              </div>
              <div className="text-sm text-green-600 font-medium">
                ↑ 8% from last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Orders
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛒</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-green-600 font-medium">
                ↑ 23% from last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Pending
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Orders to process
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Overview Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Overview</h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorOrders"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="day"
                        stroke="#6B7280"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOrders)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-center text-gray-400">
                      <svg
                        className="w-16 h-16 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">Loading chart...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Revenue Sources
                </h2>
              </div>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Direct Sales", value: 65, color: "#3B82F6" },
                          { name: "Social Media", value: 35, color: "#10B981" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-blue-500 flex items-center justify-center relative">
                      <div
                        className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent border-l-transparent"
                        style={{ transform: "rotate(90deg)" }}
                      ></div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          100%
                        </div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Direct</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Social</span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Progress */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    User Registrations
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    75%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Product Listings
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    60%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Order Completion
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    90%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Customer Satisfaction
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    85%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
