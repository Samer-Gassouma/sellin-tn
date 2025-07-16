import { NextRequest, NextResponse } from 'next/server';

// Define store data interface
interface StoreData {
  name: string;
  createdAt: string;
  status: string;
  subdomain: string;
  assetsPath: string;
}

// In-memory store for demo purposes (use database in production)
const stores: Record<string, StoreData> = {
  // Add some demo stores for testing
  teststore: {
    name: 'teststore',
    createdAt: new Date().toISOString(),
    status: 'active',
    subdomain: 'teststore',
    assetsPath: '/stores/teststore/assets'
  },
  demo: {
    name: 'demo',
    createdAt: new Date().toISOString(),
    status: 'active',
    subdomain: 'demo',
    assetsPath: '/stores/demo/assets'
  }
};

// Validate store name
function isValidStoreName(name: string): boolean {
  if (!name || name.length < 3 || name.length > 50) {
    return false;
  }
  
  // Only allow alphanumeric characters and hyphens
  const validPattern = /^[a-zA-Z0-9-]+$/;
  return validPattern.test(name);
}

export async function POST(request: NextRequest) {
  try {
    const { storeName } = await request.json();

    // Validate input
    if (!storeName) {
      return NextResponse.json(
        { error: 'Store name is required' },
        { status: 400 }
      );
    }

    const normalizedName = storeName.toLowerCase().trim();

    // Validate store name format
    if (!isValidStoreName(normalizedName)) {
      return NextResponse.json(
        { 
          error: 'Invalid store name. Use 3-50 characters, letters, numbers, and hyphens only.' 
        },
        { status: 400 }
      );
    }

    // Check if store already exists
    if (stores[normalizedName]) {
      return NextResponse.json(
        { error: 'Store name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }

    // Create store data
    const storeData: StoreData = {
      name: normalizedName,
      createdAt: new Date().toISOString(),
      status: 'active',
      subdomain: normalizedName,
      assetsPath: `/stores/${normalizedName}/assets`
    };

    // Add to in-memory store
    stores[normalizedName] = storeData;

    // Determine the base URL based on environment
    const host = request.headers.get('host') || '';
    let storeUrl: string;
    
    if (host.includes('vercel.app')) {
      // For Vercel deployment, use path-based routing
      storeUrl = `https://${host}/store/${normalizedName}`;
    } else {
      // For local development, use subdomain routing
      storeUrl = `http://${normalizedName}.sellin.tn`;
    }

    console.log(`✅ Store created: ${normalizedName} -> ${storeUrl}`);

    return NextResponse.json({
      message: 'Store created successfully!',
      storeName: normalizedName,
      storeUrl: storeUrl,
      createdAt: storeData.createdAt
    });

  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const storeName = url.searchParams.get('name');

    if (storeName) {
      // Get specific store
      const store = stores[storeName.toLowerCase()];
      if (!store) {
        return NextResponse.json(
          { error: 'Store not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(store);
    } else {
      // Get all stores
      return NextResponse.json(stores);
    }
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 