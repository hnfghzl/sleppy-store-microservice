'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Hide navbar on login, register, and customer pages
  if (pathname === '/login' || pathname === '/register' || pathname?.startsWith('/customer')) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md border-b-2 border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Sleppy Store" 
              className="w-12 h-12"
            />
            <div>
              <div className="text-xl font-bold text-gray-900">
                Sleppy Store
              </div>
              <div className="text-xs text-gray-500 font-medium">Admin Panel</div>
            </div>
          </Link>

          <div className="flex gap-6 items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{user.fullName}</div>
                  <div className="text-xs">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold uppercase text-xs">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 font-semibold shadow-md transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
