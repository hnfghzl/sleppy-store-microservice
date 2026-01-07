'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    features: string[];
    image_url: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBuyNow = async () => {
    if (!user) {
      setMessage('Please login first!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/orders', {
        productId: product.id,
        quantity: 1,
      });

      setMessage('Order created successfully! Check My Orders.');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-4xl">{product.category === 'Design' ? '🎨' : product.category === 'Productivity' ? '📊' : '🎵'}</span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {product.description}
        </p>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Features:</p>
          <ul className="text-sm text-gray-700">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-primary">
            Rp {product.price.toLocaleString('id-ID')}
          </p>

          <button
            onClick={handleBuyNow}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>

        {message && (
          <p className={`text-sm mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
