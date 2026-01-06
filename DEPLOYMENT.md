# Deployment Guide

This guide covers deploying your SaaS Waitlist Platform to production.

## Prerequisites

Before deploying, ensure you have:

- A MongoDB database (MongoDB Atlas recommended for production)
- SMTP credentials or Resend API key for email notifications
- A Vercel account (or your preferred hosting platform)

## Environment Variables

Set up these environment variables in your production environment:

### Required Variables

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret - Generate a strong random string (min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Email Configuration (Choose One)

**Option 1: Using Resend (Recommended)**
```bash
RESEND_API_KEY=re_your_resend_api_key
SMTP_USER=your-email@domain.com
```

**Option 2: Using Gmail SMTP**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

**Option 3: Using Custom SMTP**
```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables
   - Redeploy the application

### Option 2: Deploy to Other Platforms

#### Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables in the Variables section
4. Deploy automatically on push

#### Render

1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

#### DigitalOcean App Platform

1. Create a new app
2. Connect your repository
3. Configure build and run commands
4. Add environment variables

## MongoDB Setup

### Using MongoDB Atlas (Recommended)

1. **Create a Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Choose your preferred region

2. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Or add your specific deployment IP addresses

3. **Create Database User**
   - Go to Database Access
   - Add New Database User
   - Set username and password (use in MONGODB_URI)
   - Grant "Read and write to any database" privileges

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with your database name (e.g., `waitlist-saas`)

## Post-Deployment Checklist

- [ ] Verify MongoDB connection is working
- [ ] Test admin registration and login
- [ ] Create a test project
- [ ] Test waitlist signup flow
- [ ] Verify referral codes are generated correctly
- [ ] Test email notifications (if configured)
- [ ] Check gamification features (leaderboard, badges)
- [ ] Test CSV export functionality
- [ ] Verify analytics dashboard
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate
- [ ] Set up monitoring and error tracking

## Security Recommendations

### Production Security

1. **Strong JWT Secret**
   ```bash
   # Generate a secure random string (32+ characters)
   openssl rand -base64 32
   ```

2. **Secure Cookies**
   - The app automatically uses secure cookies in production
   - HTTP-only cookies prevent XSS attacks
   - SameSite=Lax prevents CSRF attacks

3. **Rate Limiting**
   - Consider adding rate limiting middleware for API routes
   - Prevent spam signups and brute force attacks

4. **MongoDB Security**
   - Use strong database passwords
   - Enable IP whitelisting
   - Regularly backup your database
   - Enable audit logs

5. **Environment Variables**
   - Never commit `.env` files to version control
   - Rotate secrets regularly
   - Use different credentials for development and production

## Custom Domain Setup

### Vercel

1. Go to your project settings
2. Navigate to Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

### Update Environment Variable

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Monitoring and Maintenance

### Recommended Tools

- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Vercel Analytics, Google Analytics
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Vercel Speed Insights, Lighthouse

### Regular Maintenance

- Monitor database size and performance
- Review and clean up old waitlist entries
- Check email delivery rates
- Update dependencies regularly
- Backup database weekly
- Review security logs

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify MONGODB_URI is correct
- Check network access settings in MongoDB Atlas
- Ensure database user has correct permissions

**Authentication Not Working**
- Verify JWT_SECRET is set
- Check cookie settings in production
- Ensure HTTPS is enabled

**Emails Not Sending**
- Verify SMTP credentials
- Check email provider settings
- Enable "Less secure app access" for Gmail
- Use app-specific passwords for Gmail

**Build Errors**
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall dependencies: `npm install`
- Run build locally: `npm run build`

## Support

For issues or questions:
- Check the README.md for setup instructions
- Review GETTING_STARTED.md for quick start guide
- Open an issue on GitHub

## Backup and Recovery

### Database Backup

**MongoDB Atlas**
- Automatic backups enabled by default
- Manual backup: Database → Backup → On-Demand Snapshot

**Manual Backup**
```bash
mongodump --uri="your-mongodb-uri" --out=./backup
```

**Restore from Backup**
```bash
mongorestore --uri="your-mongodb-uri" ./backup
```

---

**Congratulations!** Your SaaS Waitlist Platform is now deployed and ready to use.
