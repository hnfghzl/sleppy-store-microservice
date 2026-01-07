'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    fetchCart();
  }, [user, router, isLoading]);

  const fetchCart = () => {
    // Get cart from localStorage
    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
    setLoading(false);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    setProcessingPayment(true);
    try {
      // Create orders for all items
      for (const item of cartItems) {
        await api.post('/orders/checkout', {
          productId: item.product_id,
          quantity: item.quantity,
          paymentMethod: 'qris'
        });
      }
      
      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);
      setShowCheckoutModal(false);
      alert('Payment successful! All orders completed.');
      router.push('/customer/orders');
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.error || 'Checkout failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Sleppy Store" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-xs text-gray-500">Review your items</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/customer')}
                className="text-gray-700 hover:text-blue-600 font-medium text-sm"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push('/customer/orders')}
                className="text-gray-700 hover:text-blue-600 font-medium text-sm"
              >
                My Orders
              </button>
              <div className="flex items-center gap-3 border-l border-gray-300 pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <button
              onClick={() => router.push('/customer')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product_id} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.product_name}</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center text-gray-600 hover:text-blue-600 font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center text-gray-600 hover:text-blue-600 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-blue-600">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan QRIS to Pay</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="font-semibold text-gray-900">{cartItems.length} products</p>
              <p className="text-sm text-gray-600 mt-3 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                Rp {getTotalPrice().toLocaleString('id-ID')}
              </p>
            </div>

            {/* QRIS Code */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 flex flex-col items-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg mb-3">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=QRIS_CART_${getTotalPrice()}`}
                  alt="QRIS Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan with your e-wallet app
              </p>
              <div className="flex gap-3 mt-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                  GP
                </div>
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-xs font-bold text-green-600">
                  OV
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-xs font-bold text-purple-600">
                  DA
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                disabled={processingPayment}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={processingPayment}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold disabled:opacity-50"
              >
                {processingPayment ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Click "Confirm Payment" after scanning QRIS
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
