# Getting Started with SaaS Waitlist Platform

This guide will help you set up and run your multi-project SaaS waitlist platform locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR a MongoDB Atlas account
- An email service (optional, for notifications)

## Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/waitlist-saas
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/waitlist-saas

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

### Important Notes:
- **JWT_SECRET**: Generate a strong random string (at least 32 characters). You can use: `openssl rand -base64 32`
- **MongoDB**: If using local MongoDB, make sure it's running. If using Atlas, create a free cluster at mongodb.com/cloud/atlas
- **Email**: For Gmail, you need to create an "App Password" in your Google Account settings

## Step 3: Start MongoDB (if running locally)

```bash
# On macOS (with Homebrew)
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

## Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Create Your First Admin Account

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Create an admin account with your email and password
3. You'll be redirected to the admin dashboard

## Step 6: Create Your First Waitlist Project

1. In the admin dashboard, click "Create New Project"
2. Fill in the project details:
   - Name (e.g., "My Awesome Product")
   - Slug (e.g., "awesome-product" - will be used in the URL)
   - Description
   - Launch date
   - Custom branding (colors, logo)
3. Click "Create Project"

## Step 7: Access Your Public Waitlist Page

Your waitlist page will be available at:
```
http://localhost:3000/project/[your-slug]
```

For example: `http://localhost:3000/project/awesome-product`

## Features You Can Use:

### Admin Dashboard Features:
- ✅ Create and manage multiple waitlist projects
- ✅ View analytics (total signups, daily trends, role breakdown)
- ✅ Export waitlist data as CSV
- ✅ Send notification emails to waitlist users
- ✅ Custom branding per project
- ✅ Secure JWT authentication with bcryptjs

### Public Waitlist Features:
- ✅ Beautiful landing pages with countdown timers
- ✅ Waitlist signup forms with role selection
- ✅ Referral tracking system
- ✅ Custom branding (colors, logos, descriptions)
- ✅ Responsive design for mobile and desktop

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services list` (macOS) or `systemctl status mongod` (Linux)
- Check your MONGODB_URI in `.env` is correct

### JWT Token Errors
- Make sure JWT_SECRET is set in `.env`
- Ensure JWT_SECRET is at least 32 characters long

### Email Sending Issues
- For Gmail: Enable 2-factor authentication and create an App Password
- Check SMTP credentials are correct
- Email features are optional - the app works without them

## Deployment

Ready to deploy? Check the README.md for Vercel deployment instructions.

## Need Help?

- Check the README.md for detailed documentation
- Review the code comments for implementation details
- MongoDB docs: https://docs.mongodb.com
- Next.js docs: https://nextjs.org/docs
