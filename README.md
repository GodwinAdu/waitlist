# Multi-Project SaaS Waitlist Platform

A full-stack Next.js application for managing multiple waitlist projects with authentication, gamification, analytics, email notifications, and subscription-based access control.

## Features

### Core Features
- **Multi-Project Management**: Create and manage waitlist projects based on your subscription tier
- **Subscription System**: Flexible pricing with Free, Pro, and Enterprise tiers powered by Paystack (Ghana Cedis)
- **Custom Branding**: Personalize each project with colors, logos, and styling
- **JWT Authentication**: Secure admin access with bcryptjs password hashing and HTTP-only cookies
- **Public Landing Pages**: Beautiful, responsive landing pages for each project
- **Waitlist Forms**: Capture user information with validation and duplicate prevention
- **Countdown Timer**: Display launch countdown for projects
- **MongoDB Integration**: Scalable database with Mongoose schemas

### Subscription Tiers

| Tier | Price (GHS/month) | Projects | Waitlist Users | Features |
|------|-------------------|----------|----------------|----------|
| **Free** | 0 | 3 | 50 per project | Basic analytics, email notifications, referral system |
| **Pro** | 50 | 20 | 1,000 per project | Advanced analytics, custom branding, CSV export, priority support |
| **Enterprise** | 200 | Unlimited | Unlimited | All features, API access, white-label options, dedicated support |

### Gamification System
- **Referral System**: Built-in referral codes with automatic tracking
- **Tiered Rewards**: Bronze, Silver, Gold, and Platinum tiers based on referrals
- **Achievement Badges**: Unlock badges for milestones (Early Bird, Influencer, etc.)
- **Points System**: Earn points for signups and referrals
- **Live Leaderboard**: Real-time display of top referrers
- **Recent Signups**: Live feed showing recent waitlist joins
- **Waitlist Position**: Show users their position in line

### Analytics & Management
- **Analytics Dashboard**: Track signups, roles, daily trends, and conversions
- **Email Notifications**: Send notifications to waitlist users
- **CSV Export**: Download waitlist data for external use
- **Search & Filter**: Find users quickly in the admin panel
- **Bulk Actions**: Mark multiple users as notified at once

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs and HTTP-only cookies
- **Payments**: Paystack for subscription billing (Ghana Cedis)
- **Styling**: Tailwind CSS v4
- **Email**: Nodemailer (supports Resend and SMTP)
- **UI Components**: shadcn/ui
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or cloud)
- Paystack account (for subscription billing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_jwt_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Paystack Configuration
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
   PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
   
   # Email (optional)
   RESEND_API_KEY=your_resend_api_key
   # Or use SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### First Steps

1. Register an admin account at `/register` (starts with Free tier)
2. Log in at `/login`
3. Create your first project from the admin dashboard (up to 3 on Free tier)
4. Upgrade your subscription at `/admin/billing` for more projects and features
5. Share your project URL (`/project/[slug]`) to collect signups
6. Users can refer friends and climb the leaderboard
7. Monitor analytics and manage signups from the admin panel

## Project Structure

```
├── app/
│   ├── admin/                 # Admin dashboard pages
│   │   ├── billing/           # Subscription & billing management
│   │   └── projects/          # Project management
│   │       └── [id]/          # Project details
│   │           └── waitlist/  # Waitlist management
│   ├── api/
│   │   ├── admin/
│   │   │   └── subscription/  # Get subscription details
│   │   ├── auth/              # Authentication endpoints
│   │   ├── projects/          # Project CRUD and analytics
│   │   ├── subscription/      # Subscription management
│   │   │   ├── initialize/    # Initialize Paystack payment
│   │   │   └── verify/        # Verify payment
│   │   └── waitlist/          # Public waitlist signup
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── project/[slug]/        # Public landing pages
│   │   └── success/           # Success page after signup
│   └── page.tsx               # Home page
├── components/
│   ├── admin/                 # Admin components
│   ├── waitlist/              # Waitlist form & countdown
│   ├── gamification/          # Gamification components
│   │   ├── leaderboard.tsx    # Top referrers
│   │   ├── live-signups.tsx   # Recent signups
│   │   └── achievement-badges.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # JWT authentication utilities
│   ├── db.ts                  # MongoDB connection
│   ├── email.ts               # Email sending utilities
│   ├── gamification.ts        # Tier/badge/points logic
│   └── subscription.ts        # Subscription plans & limits
├── models/
│   ├── Admin.ts               # Admin user schema with subscription
│   ├── Project.ts             # Project schema
│   └── WaitlistUser.ts        # Waitlist user schema
└── proxy.ts                   # Authentication middleware
```

## Gamification System

### Tier Structure

| Tier | Referrals Required | Benefits |
|------|-------------------|----------|
| 🥉 Bronze | 0-4 | Standard access |
| 🥈 Silver | 5-9 | Priority support |
| 🥇 Gold | 10-24 | Early features & exclusive content |
| 💎 Platinum | 25+ | VIP benefits & lifetime perks |

### Achievement Badges

- **Early Bird** 🐦 - One of the first 100 to join
- **Connector** 🤝 - Made your first referral
- **Influencer** ⭐ - Referred 5 or more people
- **Super Influencer** 🌟 - Referred 10 or more people
- **Legend** 👑 - Referred 25 or more people

### Points System

- Join waitlist: 10 points
- Each referral: 50 points
- Early bird bonus: Up to 100 points (for first 100 signups)

## API Routes

### Authentication
- `POST /api/auth/register` - Register admin account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user with subscription info

### Subscription
- `GET /api/admin/subscription` - Get subscription details
- `POST /api/subscription/initialize` - Initialize Paystack payment
- `GET /api/subscription/verify` - Verify payment and activate subscription

### Projects (Protected with subscription limits)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (enforces subscription limits)
- `GET /api/projects/[id]` - Get project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/[id]/analytics` - Get analytics
- `GET /api/projects/[id]/leaderboard` - Get top referrers
- `GET /api/projects/[id]/recent-signups` - Get recent signups
- `GET /api/projects/[id]/waitlist` - Get waitlist users
- `GET /api/projects/[id]/waitlist/export` - Export CSV
- `POST /api/projects/[id]/waitlist/notify` - Send notifications
- `PATCH /api/projects/[id]/waitlist/notify` - Mark as notified

### Public
- `GET /api/projects/slug/[slug]` - Get project by slug
- `POST /api/waitlist` - Join waitlist (enforces subscription limits)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Vercel, Railway, Render, and DigitalOcean deployment
- MongoDB Atlas setup
- Environment variable configuration
- Security best practices
- Custom domain setup
- Monitoring and maintenance

Quick Deploy to Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Required Environment Variables for Production

- `MONGODB_URI` - Your production MongoDB connection string
- `JWT_SECRET` - A strong, unique secret key (32+ characters)
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `PAYSTACK_SECRET_KEY` - Your Paystack secret key
- `PAYSTACK_PUBLIC_KEY` - Your Paystack public key
- Email configuration (RESEND_API_KEY or SMTP credentials)

## Subscription Management

### Setting Up Paystack

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your test keys from the dashboard
3. Add keys to your environment variables
4. Test subscription flow in development
5. Switch to live keys for production

### Subscription Features

- Automatic payment verification via Paystack webhook
- Monthly billing cycle (30 days)
- Payment history tracking
- Upgrade/downgrade between tiers
- Subscription status monitoring (active/expired/cancelled)
- Automatic enforcement of project and waitlist limits

### Enforcing Limits

The platform automatically enforces subscription limits:
- Project creation blocked when limit reached
- Waitlist signup blocked when limit reached
- Visual warnings in admin dashboard
- Upgrade prompts for users at limits

## Database Schema

### Admin
- username, email, password (hashed)
- subscriptionTier (free/pro/enterprise)
- subscriptionStatus (active/expired/cancelled)
- subscriptionReference, subscriptionStartDate, subscriptionEndDate
- paymentHistory array
- Timestamps

### Project
- name, slug, description, tagline
- logo, primaryColor, backgroundImage
- launchDate, features array
- adminId reference
- Gamification flags
- Timestamps

### WaitlistUser
- projectId reference
- name, email, phone, role, message
- referralCode, referredBy reference
- referralCount, position
- tier, badges array, points
- isNotified, notifiedAt
- Timestamps

## Development

### Running Tests

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

### Authentication Not Working
- Verify JWT_SECRET is set and strong
- Check cookies in browser dev tools
- Ensure HTTPS in production

### Subscription/Payment Issues
- Verify Paystack keys are correct (test vs live)
- Check payment callback URL matches your domain
- Ensure webhook verification is working
- Check payment history in Paystack dashboard

### Emails Not Sending
- Verify SMTP credentials
- Check email provider settings
- Enable app-specific passwords for Gmail

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For issues or questions, please open a GitHub issue.
