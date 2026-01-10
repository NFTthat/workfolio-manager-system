# 🚀 Deployment Guide

This guide covers different deployment options for the Portfolio Management System.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Docker Deployment](#docker-deployment)
- [Traditional Server Deployment](#traditional-server-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [SSL/HTTPS Configuration](#ssl-https-configuration)

## Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Project repository on GitHub

### Steps

1. **Connect Repository to Vercel**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel dashboard, go to Project Settings → Environment Variables:
   ```env
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your-super-secret-key-here
   DATABASE_URL=file:./db/custom.db
   ```

4. **Deploy**
   - Vercel will automatically detect it's a Next.js app
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Vercel Configuration

The `vercel.json` file is already configured for optimal deployment:
- Automatic builds on every push
- Environment variables setup
- Proper routing configuration

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Server with Docker support

### Quick Start

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd portfolio-management-system
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and Run**
   ```bash
   # Build the image
   docker build -t portfolio-app .
   
   # Run the container
   docker run -p 3000:3000 --env-file .env portfolio-app
   ```

3. **Using Docker Compose**
   ```bash
   # Start with docker-compose
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop the services
   docker-compose down
   ```

### Production Docker Setup

For production, consider using nginx as a reverse proxy:

```bash
# Start with nginx proxy
docker-compose --profile with-proxy up -d
```

Create `nginx.conf` for SSL termination and load balancing.

## Traditional Server Deployment

### Prerequisites
- Server with Node.js 18+
- PM2 for process management
- Nginx (optional, for reverse proxy)

### Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd portfolio-management-system
   
   # Install dependencies
   npm install
   
   # Setup environment
   cp .env.example .env
   # Edit .env with production values
   
   # Build application
   npm run build
   
   # Setup database
   npm run db:push
   npm run db:generate
   ```

3. **Start with PM2**
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'portfolio-app',
       script: 'npm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

4. **Setup Nginx (Optional)**
   ```bash
   # Install nginx
   sudo apt install nginx -y
   
   # Create nginx configuration
   sudo tee /etc/nginx/sites-available/portfolio << EOF
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
           proxy_cache_bypass \$http_upgrade;
       }
   }
   EOF
   
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Environment Variables

### Required Variables
```env
# Database Configuration
DATABASE_URL=file:./db/custom.db

# NextAuth.js Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here
```

### Security Best Practices
- Use a strong, randomly generated `NEXTAUTH_SECRET`
- Never commit `.env` files to version control
- Use different secrets for development and production
- Rotate secrets periodically

### Generating Secrets
```bash
# Generate a strong secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Setup

### SQLite (Default)
The application uses SQLite by default, which requires minimal setup:

```bash
# Create database directory
mkdir -p db

# Initialize database
npm run db:push
npm run db:generate
```

### Database Backups
```bash
# Create backup
sqlite3 db/custom.db ".backup backup-$(date +%Y%m%d).db"

# Restore backup
sqlite3 db/custom.db ".restore backup-20231201.db"
```

### Production Considerations
- SQLite is suitable for small to medium traffic
- For high traffic, consider PostgreSQL or MySQL
- Regular backups are essential
- Monitor database size and performance

## SSL/HTTPS Configuration

### Let's Encrypt with Nginx
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl status certbot.timer
```

### Vercel SSL
Vercel provides automatic SSL certificates for all deployments.

### Docker SSL Setup
For Docker deployments, use Let's Encrypt with nginx:

```nginx
# nginx.conf snippet for SSL
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

## Monitoring and Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs portfolio-app

# Restart application
pm2 restart portfolio-app
```

### Health Checks
The application includes a health check endpoint:
```
GET /api/health
```

### Log Management
- Configure log rotation for production
- Use structured logging for better analysis
- Set up alerts for critical errors

## Performance Optimization

### Next.js Optimizations
- Enable static generation where possible
- Use image optimization
- Implement proper caching strategies
- Monitor bundle size

### Server Optimizations
- Use PM2 cluster mode for multi-core utilization
- Implement proper caching
- Monitor memory usage
- Set up auto-scaling if needed

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database file exists
   ls -la db/custom.db
   
   # Verify permissions
   chmod 644 db/custom.db
   ```

2. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Authentication Issues**
   ```bash
   # Verify NEXTAUTH_URL matches your domain
   # Check NEXTAUTH_SECRET is properly set
   # Clear browser cookies and cache
   ```

### Debug Commands
```bash
# Check application status
pm2 status

# View real-time logs
pm2 logs --lines 100 portfolio-app

# Restart with fresh environment
pm2 delete portfolio-app
pm2 start ecosystem.config.js
```

## Support

For deployment issues:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Review the troubleshooting section above
5. Create an issue in the GitHub repository with deployment details