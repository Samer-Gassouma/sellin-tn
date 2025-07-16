'use client';

import { useState } from 'react';

export default function Home() {
  const [storeName, setStoreName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [storeUrl, setStoreUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    setIsLoading(true);
    setMessage('');

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
        setMessage('Store created successfully!');
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
                Your store will be available at: <span className="font-medium">{storeName.toLowerCase() || 'yourstore'}.sellin.tn</span>
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
          <div className={`mt-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
            {storeUrl && (
              <div className="mt-2">
                <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline hover:no-underline">
                  Visit your store: {storeUrl}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Already have a store? Visit yourstore.sellin.tn</p>
        </div>
      </div>
    </div>
  );
}
