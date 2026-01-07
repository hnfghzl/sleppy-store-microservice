'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen shadow-sm z-10 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-200">
          <img src="/logo.png" alt="Sleppy Store" className="w-10 h-10" />
          <div>
            <div className="font-bold text-lg text-gray-900">Sleppy Store</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => router.push('/')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm flex items-center space-x-3 transition ${
              isActive('/') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => router.push('/admin/users')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm flex items-center space-x-3 transition ${
              isActive('/admin/users') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Users</span>
          </button>
          <button
            onClick={() => router.push('/admin/products')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm flex items-center space-x-3 transition ${
              isActive('/admin/products') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Products</span>
          </button>
          <button
            onClick={() => router.push('/admin/orders')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm flex items-center space-x-3 transition ${
              isActive('/admin/orders') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
            <div className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
