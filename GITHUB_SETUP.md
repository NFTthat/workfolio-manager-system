# 🚀 GitHub Repository Setup & Deployment Guide

This guide will walk you through setting up your Portfolio Management System on GitHub and deploying it to production.

## 📋 Prerequisites

- GitHub account
- Local development environment set up
- Portfolio Management System code ready

## 🎯 Step 1: Create GitHub Repository

### Option A: Using GitHub Website

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Log in to your account

2. **Create New Repository**
   - Click the "+" icon in the top-right corner
   - Select "New repository"
   - Fill in the repository details:
     - **Repository name**: `portfolio-management-system` (or your preferred name)
     - **Description**: `A modern portfolio management system with admin dashboard`
     - **Visibility**: Choose Public or Private
     - **Initialize with README**: ❌ Uncheck (we already have one)
     - **Add .gitignore**: ❌ Uncheck (we already have one)
     - **Choose a license**: Select your preferred license (MIT recommended)

3. **Create Repository**
   - Click "Create repository"

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
# On macOS: brew install gh
# On Ubuntu: sudo apt install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create portfolio-management-system --public --description "A modern portfolio management system with admin dashboard"

# Confirm creation
gh repo view portfolio-management-system
```

## 🔄 Step 2: Connect Local Repository to GitHub

### Method 1: Using HTTPS (Recommended for beginners)

```bash
# Add the remote repository
git remote add origin https://github.com/your-username/portfolio-management-system.git

# Push to GitHub
git push -u origin master

# Verify the push
git remote -v
```

### Method 2: Using SSH (Recommended for developers)

```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your-email@example.com"

# Start SSH agent and add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy SSH public key
cat ~/.ssh/id_ed25519.pub

# Add SSH key to GitHub:
# 1. Go to GitHub → Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste your public key
# 4. Test connection: ssh -T git@github.com

# Add remote repository using SSH
git remote add origin git@github.com:your-username/portfolio-management-system.git

# Push to GitHub
git push -u origin master
```

## 🚀 Step 3: Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account
- GitHub repository connected

### Deployment Steps

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"

2. **Import Repository**
   - Find your `portfolio-management-system` repository
   - Click "Import"

3. **Configure Environment Variables**
   In the project settings, add these environment variables:
   ```env
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your-super-secret-key-here
   DATABASE_URL=file:./db/custom.db
   ```

4. **Deploy**
   - Vercel will automatically detect the Next.js setup
   - Click "Deploy"
   - Wait for the build to complete

5. **Configure Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow the DNS configuration instructions

### Automatic Deployments

Vercel automatically deploys:
- On every push to the main branch
- On every pull request (preview deployments)
- On every push to any branch (if configured)

## 🐳 Step 4: Alternative Deployment Options

### Docker Deployment

1. **Build and Push to Docker Hub**
   ```bash
   # Build Docker image
   docker build -t your-username/portfolio-management-system:latest .
   
   # Tag the image
   docker tag your-username/portfolio-management-system:latest your-username/portfolio-management-system:v1.0.0
   
   # Push to Docker Hub
   docker push your-username/portfolio-management-system:latest
   docker push your-username/portfolio-management-system:v1.0.0
   ```

2. **Deploy to Cloud Providers**
   - **AWS ECS**: Use Amazon Elastic Container Service
   - **Google Cloud Run**: Deploy container to Cloud Run
   - **Azure Container Instances**: Deploy to Azure

### Traditional Server Deployment

1. **Prepare Server**
   ```bash
   # Connect to your server
   ssh user@your-server-ip
   
   # Update system and install Node.js
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/portfolio-management-system.git
   cd portfolio-management-system
   
   # Install dependencies
   npm install
   
   # Setup environment
   cp .env.example .env
   # Edit .env with production values
   
   # Build and start
   npm run build
   pm2 start npm --name portfolio-app -- start
   pm2 save
   pm2 startup
   ```

## 🔧 Step 5: Post-Deployment Configuration

### Environment Variables Setup

For production, ensure these environment variables are properly set:

```env
# Required
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here
DATABASE_URL=file:./db/custom.db

# Optional: For email notifications (if implemented)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

### Database Initialization

After deployment, initialize the database:

```bash
# For Vercel deployment (using Vercel CLI)
vercel env pull .env.production
npm run db:push
npm run db:generate

# For server deployment
npm run db:push
npm run db:generate
```

### SSL/HTTPS Setup

#### For Vercel
- SSL is automatically provided
- Custom domains get automatic SSL certificates

#### For Server Deployment
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal setup
sudo systemctl enable certbot.timer
```

## 📊 Step 6: Monitoring and Maintenance

### Health Checks

Your application includes a health check endpoint:
```
GET /api/health
```

Set up monitoring to check this endpoint regularly.

### Log Management

#### For Vercel
- Use Vercel's built-in logging
- Check the "Functions" tab for API logs
- Use Vercel Analytics for performance monitoring

#### For Server Deployment
```bash
# PM2 monitoring
pm2 monit

# Log rotation setup
pm2 install pm2-logrotate

# View logs
pm2 logs portfolio-app
```

### Backup Strategy

#### Database Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
sqlite3 db/custom.db ".backup $BACKUP_DIR/portfolio_$DATE.db"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "portfolio_*.db" -mtime +7 -delete

echo "Backup completed: portfolio_$DATE.db"
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## 🚨 Step 7: Security Considerations

### Production Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS
- [ ] Set up proper CORS headers
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Set up proper file permissions
- [ ] Enable security headers

### Security Headers

Add these security headers to your Next.js configuration:

```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:;",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

## 🎉 Step 8: Go Live!

### Final Checklist

- [ ] Repository is pushed to GitHub
- [ ] Deployment is successful
- [ ] Environment variables are set
- [ ] Database is initialized
- [ ] SSL/HTTPS is configured
- [ ] Health checks are passing
- [ ] Admin login is working
- [ ] Public portfolio is accessible
- [ ] File uploads are working
- [ ] Real-time features are functional

### Access Points

- **Public Portfolio**: `https://your-domain.com`
- **Admin Dashboard**: `https://your-domain.com/admin`
- **API Documentation**: Check the `/api` endpoints
- **Health Check**: `https://your-domain.com/api/health`

### Default Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials immediately after first login!

## 📞 Support and Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check environment variables
   - Verify Node.js version
   - Review build logs

2. **Database Connection Issues**
   - Ensure database file exists
   - Check file permissions
   - Verify DATABASE_URL

3. **Authentication Issues**
   - Verify NEXTAUTH_URL
   - Check NEXTAUTH_SECRET
   - Clear browser cookies

### Getting Help

1. **Check Logs**: Review deployment and application logs
2. **GitHub Issues**: Create an issue with detailed error information
3. **Documentation**: Review the README and deployment guides
4. **Community**: Check for similar issues in the repository

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

🎉 **Congratulations!** Your Portfolio Management System is now live on GitHub and deployed to production!

Remember to:
- Regularly update dependencies
- Monitor application performance
- Keep backups of your data
- Stay updated with security best practices