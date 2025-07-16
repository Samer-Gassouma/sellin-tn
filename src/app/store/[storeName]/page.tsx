import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// Define the stores data file path
const STORES_DATA_FILE = path.join(process.cwd(), 'stores-data.json');

// Load stores data
function loadStoresData() {
  try {
    if (fs.existsSync(STORES_DATA_FILE)) {
      const data = fs.readFileSync(STORES_DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error loading stores data:', error);
    return {};
  }
}

// Generate metadata for the store page
export async function generateMetadata({ params }: { params: Promise<{ storeName: string }> }) {
  const resolvedParams = await params;
  const storesData = loadStoresData();
  const storeData = storesData[resolvedParams.storeName];

  if (!storeData) {
    return {
      title: 'Store Not Found - Sellin TN',
      description: 'The requested store was not found.',
    };
  }

  return {
    title: `${storeData.name} - Online Store`,
    description: `Welcome to ${storeData.name} online store. Shop our products and services.`,
  };
}

export default async function StorePage({ params }: { params: Promise<{ storeName: string }> }) {
  const resolvedParams = await params;
  const storesData = loadStoresData();
  const storeData = storesData[resolvedParams.storeName];

  // If store doesn't exist, show 404
  if (!storeData) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{storeData.name}</h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {storeData.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {storeData.subdomain}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {storeData.name}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your online store is ready! This is where your customers will discover your products.
          </p>
          
          {/* Store Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Store Name</dt>
                    <dd className="text-lg text-gray-900">{storeData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">{formatDate(storeData.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900 capitalize">{storeData.status}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Add Products
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Customize Store
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 Store Features Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Your store is being prepared with amazing features to help you sell online.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Product Catalog</h4>
                <p className="text-sm text-gray-600">Add and manage your products with ease</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💳</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Payment Processing</h4>
                <p className="text-sm text-gray-600">Secure checkout and payment options</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                <p className="text-sm text-gray-600">Track your sales and customer insights</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Powered by <span className="font-medium">Sellin TN</span>
            </p>
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create Your Store
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 