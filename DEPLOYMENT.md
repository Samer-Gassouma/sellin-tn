# Sellin TN Deployment Guide

This guide will help you deploy the Sellin TN multi-tenant e-commerce platform with dynamic subdomain support.

## Prerequisites

- Node.js 18+ installed
- Nginx installed and configured
- Domain name (sellin.tn) pointed to your server
- SSL certificate for wildcard subdomain (*.sellin.tn)
- Root access to your server

## Quick Start

### 1. Clone and Setup Application

```bash
cd /var/www
git clone <your-repo> sellin-tn
cd sellin-tn
npm install
```

### 2. Environment Configuration

```bash
cp env.example .env
nano .env
```

Update the `.env` file with your domain and configuration:
```
NODE_ENV=production
PORT=3000
DOMAIN=sellin.tn
PROTOCOL=https
```

### 3. Build Application

```bash
npm run build
```

### 4. Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/sellin-tn
sudo ln -s /etc/nginx/sites-available/sellin-tn /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 5. SSL Certificate Setup

For wildcard SSL certificate (*.sellin.tn), you can use Let's Encrypt with Certbot:

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns -d sellin.tn -d *.sellin.tn
```

After obtaining certificates, update the nginx.conf file to enable SSL sections.

### 6. Process Management (PM2)

Install and configure PM2 for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sellin-tn',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## DNS Configuration

### A Records
- `sellin.tn` → Your server IP
- `*.sellin.tn` → Your server IP

### Example DNS Setup (Cloudflare/OVH)
```
Type: A
Name: @
Content: YOUR_SERVER_IP
TTL: Auto

Type: A  
Name: *
Content: YOUR_SERVER_IP
TTL: Auto
```

## Directory Structure

After deployment, your directory structure should look like:

```
/var/www/sellin-tn/
├── src/                    # Next.js source code
├── stores/                 # Store assets (auto-created)
├── stores-data.json       # Store metadata (auto-created)
├── nginx.conf             # Nginx configuration
├── ecosystem.config.js    # PM2 configuration
├── env.example           # Environment variables template
├── .env                  # Your environment variables
└── logs/                 # Application logs
```

## Testing the Setup

### 1. Test Main Domain
```bash
curl -H "Host: sellin.tn" http://localhost
```

### 2. Create a Test Store
```bash
curl -X POST http://sellin.tn/api/create-store \
  -H "Content-Type: application/json" \
  -d '{"storeName": "teststore"}'
```

### 3. Test Subdomain
```bash
curl -H "Host: teststore.sellin.tn" http://localhost
```

## Monitoring

### Check Application Status
```bash
pm2 status
pm2 logs sellin-tn
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check SSL Certificate
```bash
sudo certbot certificates
```

## Maintenance

### Update Application
```bash
cd /var/www/sellin-tn
git pull
npm install
npm run build
pm2 restart sellin-tn
```

### Renew SSL Certificate
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

### Backup Store Data
```bash
# Backup stores data
cp stores-data.json stores-data-backup-$(date +%Y%m%d).json

# Backup stores directory
tar -czf stores-backup-$(date +%Y%m%d).tar.gz stores/
```

## Troubleshooting

### Common Issues

1. **Subdomain not working**: Check DNS propagation and nginx configuration
2. **SSL certificate issues**: Verify wildcard certificate is correctly configured
3. **Application not starting**: Check PM2 logs and environment variables
4. **API errors**: Check application logs and file permissions

### Debug Commands
```bash
# Check DNS resolution
nslookup teststore.sellin.tn

# Test nginx configuration
sudo nginx -t

# Check port binding
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Check PM2 processes
pm2 list
pm2 info sellin-tn
```

## Security Considerations

1. **File permissions**: Ensure proper permissions for stores directory
2. **Rate limiting**: Configure nginx rate limiting (already included)
3. **SSL**: Always use HTTPS in production
4. **Firewall**: Configure UFW or iptables
5. **Updates**: Keep system and dependencies updated

## Support

For issues or questions, check the application logs and nginx error logs first. The platform includes built-in error handling and logging for troubleshooting. 