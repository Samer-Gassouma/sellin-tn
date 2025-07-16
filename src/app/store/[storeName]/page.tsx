import { notFound } from 'next/navigation';
import Link from 'next/link';

// Define store data interface
interface StoreData {
  name: string;
  createdAt: string;
  status: string;
  subdomain: string;
  assetsPath: string;
}

// Load stores data from API
async function loadStoreData(storeName: string): Promise<StoreData | null> {
  try {
    // For server-side rendering, we need to construct the full URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://sellin-tn.vercel.app';
    
    const response = await fetch(`${baseUrl}/api/create-store?name=${storeName}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading store data:', error);
    return null;
  }
}

// Generate metadata for the store page
export async function generateMetadata({ params }: { params: Promise<{ storeName: string }> }) {
  const resolvedParams = await params;
  const storeData = await loadStoreData(resolvedParams.storeName);

  if (!storeData) {
    return {
      title: 'Store Not Found - Sellin TN',
      description: 'The requested store was not found.',
    };
  }

  return {
    title: `Hello from ${storeData.name} - Sellin TN`,
    description: `Welcome to ${storeData.name}! Your personal store on Sellin TN platform.`,
  };
}

// Store page component
export default async function StorePage({ params }: { params: Promise<{ storeName: string }> }) {
  const resolvedParams = await params;
  const storeData = await loadStoreData(resolvedParams.storeName);

  // If store not found, show 404
  if (!storeData) {
    notFound();
  }

  // Format the creation date
  const createdDate = new Date(storeData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Greeting Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
          {/* Store Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl">🏪</span>
          </div>

          {/* Main Greeting */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Hello from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {storeData.name}
            </span>
            !
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            🎉 Your store is live and ready to welcome customers!
          </p>

          {/* Store Info */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Store Name:</span>
                <p className="text-gray-900">{storeData.name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Created:</span>
                <p className="text-gray-900">{createdDate}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <p className="text-green-600 capitalize font-medium">{storeData.status}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Store URL:</span>
                <p className="text-blue-600 truncate">{storeData.name}.sellin.tn</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              🚀 Start Building Your Store
            </button>
            
            <div className="flex gap-4">
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                📊 Analytics
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Powered by{' '}
            <Link 
              href="/" 
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sellin TN
            </Link>
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Create Another Store
          </Link>
        </div>
      </div>
    </div>
  );
} 