import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define store data interface
interface StoreData {
  name: string;
  createdAt: string;
  status: string;
  subdomain: string;
  assetsPath: string;
}

// Define the stores directory path
const STORES_DIR = path.join(process.cwd(), 'stores');
const STORES_DATA_FILE = path.join(process.cwd(), 'stores-data.json');

// Ensure stores directory exists
if (!fs.existsSync(STORES_DIR)) {
  fs.mkdirSync(STORES_DIR, { recursive: true });
}

// Load existing stores data
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

// Save stores data
function saveStoresData(data: Record<string, StoreData>) {
  try {
    fs.writeFileSync(STORES_DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving stores data:', error);
  }
}

// Validate store name
function isValidStoreName(name: string): boolean {
  // Allow only alphanumeric characters and hyphens, 3-50 characters
  const regex = /^[a-zA-Z0-9-]{3,50}$/;
  return regex.test(name) && !name.startsWith('-') && !name.endsWith('-');
}

export async function POST(request: NextRequest) {
  try {
    const { storeName } = await request.json();

    // Validate input
    if (!storeName || typeof storeName !== 'string') {
      return NextResponse.json(
        { error: 'Store name is required' },
        { status: 400 }
      );
    }

    const cleanStoreName = storeName.trim().toLowerCase();

    // Validate store name format
    if (!isValidStoreName(cleanStoreName)) {
      return NextResponse.json(
        { error: 'Store name must be 3-50 characters long and contain only letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Load existing stores
    const storesData = loadStoresData();

    // Check if store already exists
    if (storesData[cleanStoreName]) {
      return NextResponse.json(
        { error: 'Store name already exists' },
        { status: 409 }
      );
    }

    // Create store directory
    const storeDir = path.join(STORES_DIR, cleanStoreName);
    if (!fs.existsSync(storeDir)) {
      fs.mkdirSync(storeDir, { recursive: true });
      
      // Create assets subdirectories
      const assetsDir = path.join(storeDir, 'assets');
      const imagesDir = path.join(assetsDir, 'images');
      const documentsDir = path.join(assetsDir, 'documents');
      
      fs.mkdirSync(assetsDir, { recursive: true });
      fs.mkdirSync(imagesDir, { recursive: true });
      fs.mkdirSync(documentsDir, { recursive: true });
      
      // Create a README file for the store
      const readmeContent = `# ${cleanStoreName} Store\n\nThis directory contains all assets and data for the ${cleanStoreName} store.\n\nCreated: ${new Date().toISOString()}\n`;
      fs.writeFileSync(path.join(storeDir, 'README.md'), readmeContent);
    }

    // Save store data
    storesData[cleanStoreName] = {
      name: cleanStoreName,
      createdAt: new Date().toISOString(),
      status: 'active',
      subdomain: `${cleanStoreName}.sellin.tn`,
      assetsPath: storeDir
    };

    saveStoresData(storesData);

    // Return success response
    return NextResponse.json({
      success: true,
      storeName: cleanStoreName,
      storeUrl: `https://${cleanStoreName}.sellin.tn`,
      message: 'Store created successfully'
    });

  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const storesData = loadStoresData();
    return NextResponse.json({
      stores: Object.keys(storesData),
      total: Object.keys(storesData).length
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 