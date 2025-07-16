'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [storeName, setStoreName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [isVercel, setIsVercel] = useState(false);

  // Detect if we're on Vercel
  useEffect(() => {
    setIsVercel(window.location.hostname.includes('vercel.app'));
  }, []);

  const getPreviewUrl = (name: string) => {
    if (!name) return 'yourstore.sellin.tn';
    const cleanName = name.toLowerCase();
    if (isVercel) {
      return `${cleanName}-sellin-tn.vercel.app`;
    }
    return `${cleanName}.sellin.tn`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    setIsLoading(true);
    setMessage('');
    setStoreUrl('');

    try {
      const response = await fetch('/api/create-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeName: storeName.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`🎉 Store "${data.storeName}" created successfully!`);
        setStoreUrl(data.storeUrl);
      } else {
        setMessage(data.error || 'Failed to create store');
      }
    } catch {
      setMessage('An error occurred while creating the store');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏪</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sellin TN</h1>
          <p className="text-gray-600">Create your online store in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                required
                pattern="[a-zA-Z0-9-]+"
                title="Only letters, numbers, and hyphens are allowed"
              />
              <div className="mt-2 text-sm text-gray-500">
                Your store will be available at:{' '}
                <span className="font-medium text-indigo-600">
                  {getPreviewUrl(storeName)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !storeName.trim()}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Store...' : 'Create Store'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg ${message.includes('success') || message.includes('🎉') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <div className="font-medium">{message}</div>
            {storeUrl && (
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600 mb-2">Your store is ready! Click to visit:</p>
                <a 
                  href={storeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm bg-indigo-50 px-3 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  🚀 {storeUrl}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Test with existing stores:</p>
          <div className="mt-2 space-x-2">
            <a 
              href={isVercel ? "https://teststore-sellin-tn.vercel.app" : "http://teststore.sellin.tn"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              teststore
            </a>
            <span>•</span>
            <a 
              href={isVercel ? "https://demo-sellin-tn.vercel.app" : "http://demo.sellin.tn"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
