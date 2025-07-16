# Sellin TN - Multi-Tenant E-commerce Platform

A dynamic, multi-tenant e-commerce platform that allows users to create their own online stores with custom subdomains. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **Dynamic Store Creation**: Users can create stores instantly by entering a store name
- **Automatic Subdomain Generation**: Each store gets its own subdomain (e.g., `pog.sellin.tn`)
- **File System Management**: Automatic creation of store folders and asset directories
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Server-Side Rendering**: Fast, SEO-friendly pages with Next.js
- **Nginx Integration**: Production-ready reverse proxy configuration
- **Wildcard SSL Support**: Ready for SSL certificate configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- (For production) Nginx and domain name

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd sellin-tn
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp env.example .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Visit the Application**
   - Main site: http://localhost:3000
   - Test store creation and view generated subdomain pages

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React** for UI components

### Backend
- **Next.js API Routes** for store management
- **File System** for store data persistence
- **Middleware** for subdomain routing

### Infrastructure
- **Nginx** reverse proxy with wildcard subdomain support
- **PM2** for process management (production)
- **Let's Encrypt** SSL certificates (production)

## 📁 Project Structure

```
sellin-tn/
├── src/
│   ├── app/
│   │   ├── api/create-store/     # Store creation API
│   │   ├── store/[storeName]/    # Dynamic store pages
│   │   ├── page.tsx              # Main landing page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   └── middleware.ts             # Subdomain routing
├── stores/                       # Store assets (auto-created)
├── nginx.conf                    # Nginx configuration
├── DEPLOYMENT.md                 # Deployment guide
├── env.example                   # Environment variables template
└── ecosystem.config.js           # PM2 configuration (generated)
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
NODE_ENV=production
PORT=3000
DOMAIN=sellin.tn
PROTOCOL=https
```

### Nginx Setup

The included `nginx.conf` provides:
- Wildcard subdomain support (`*.sellin.tn`)
- SSL/TLS configuration (ready for certificates)
- Rate limiting and security headers
- Static asset caching
- Health check endpoint

## 🛠️ API Endpoints

### POST `/api/create-store`
Creates a new store with subdomain and file structure.

**Request:**
```json
{
  "storeName": "pog"
}
```

**Response:**
```json
{
  "success": true,
  "storeName": "pog",
  "storeUrl": "https://pog.sellin.tn",
  "message": "Store created successfully"
}
```

### GET `/api/create-store`
Returns list of all created stores.

## 🌐 How Subdomain Routing Works

1. **User visits `pog.sellin.tn`**
2. **Nginx** receives request and forwards to Next.js
3. **Middleware** detects subdomain and rewrites URL to `/store/pog`
4. **Dynamic route** `/store/[storeName]` loads store data
5. **Store page** renders with store-specific content

## 📱 Store Features

Each created store includes:
- Custom branded page with store name
- Store information display
- Future-ready structure for:
  - Product catalog
  - Payment processing
  - Analytics dashboard
  - Asset management

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production deployment instructions.

### Quick Production Deploy

```bash
# Build application
npm run build

# Start with PM2
npm run pm2:start

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/sellin-tn
sudo ln -s /etc/nginx/sites-available/sellin-tn /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

## 🔐 Security Features

- Rate limiting on API endpoints
- Input validation and sanitization
- Secure headers via Nginx
- File system isolation for stores
- SSL/TLS encryption support

## 📊 Performance

- Server-side rendering for fast initial loads
- Static asset optimization
- Nginx caching for production
- Clustered deployment with PM2

## 🛣️ Roadmap

Future enhancements planned:
- [ ] Database integration (PostgreSQL)
- [ ] User authentication system
- [ ] Product catalog management
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Analytics and reporting
- [ ] Custom themes/templates
- [ ] File upload management
- [ ] SEO optimization tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run linting and build
npm run setup        # Copy env file and install deps
npm run clean        # Clean build files and data
npm run backup       # Backup store data
npm run pm2:start    # Start with PM2
npm run pm2:restart  # Restart PM2 process
npm run pm2:status   # Check PM2 status
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues, questions, or contributions:
1. Check the logs: `npm run logs`
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
3. Open an issue on GitHub

---

**Built with ❤️ for the Tunisian e-commerce community**
