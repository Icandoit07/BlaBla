# blabla

A modern, full-stack Twitter-like social media platform built for India.

## Features

### Core Social Features
- **Posts**: Create, view, and interact with posts (max 280 characters)
- **Likes**: Like/unlike posts with real-time updates
- **Reposts**: Share posts to your feed
- **Quotes**: Quote-tweet posts with your commentary
- **Comments/Replies**: Thread conversations on posts
- **Bookmarks**: Save posts for later reading
- **Follows**: Follow/unfollow users
- **Mentions**: @mention users in posts
- **Hashtags**: Auto-extract hashtags for trending topics

### Advanced Features
- **Polls**: Create polls with 2-4 options and time limits
- **Notifications**: Get notified of likes, follows, replies, and mentions
- **Search**: Search users and posts by keyword
- **Trending**: See trending hashtags ranked by post count
- **User Profiles**: View user profiles with their post history

### Technical Features
- **Authentication**: Secure credential-based auth with NextAuth.js
- **PostgreSQL**: Production-ready relational database
- **Prisma ORM**: Type-safe database access
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Modern Cards**: Beautiful card-based UI distinct from Twitter
- **Server Components**: Optimized with Next.js 15 App Router
- **API Routes**: RESTful backend APIs for all features
- **Accessibility**: WCAG AAA compliant with dark, high-contrast input text (16.8:1 ratio)
- **User-Friendly Forms**: All inputs have crystal-clear, visible text across the entire app

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL 16 (via Docker Compose)
- **ORM**: Prisma 5
- **Auth**: OTP-based auth with JWT sessions
- **Email**: Nodemailer (SMTP)
- **SMS**: AWS SNS
- **Media Storage**: AWS S3 with Sharp for image optimization
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm

### Installation

1. **Clone and install dependencies**:
```bash
cd blabla
npm install
```

2. **Set up environment**:
Create a `.env` file in the root:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme-use-a-strong-secret-in-production
DATABASE_URL=postgresql://blabla:blabla@localhost:5433/blabla?schema=public
```

3. **Start PostgreSQL**:
```bash
npm run db:up
```

4. **Run migrations and seed**:
```bash
npm run prisma:migrate
npm run prisma:seed
```

5. **Start the development server**:
```bash
npm run dev
```

Visit http://localhost:3000

### Default Users (from seed)
- Username: `bharat`, Password: `password`
- Username: `ananya`, Password: `password`

## Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:up            # Start PostgreSQL container
npm run db:down          # Stop and remove PostgreSQL container
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations (dev)
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database with sample data
```

## Project Structure

```
blabla/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── migrations/            # Migration history
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Login page (route group)
│   │   ├── (bookmarks)/       # Bookmarks page (route group)
│   │   ├── (feed)/            # Feed page (route group)
│   │   ├── (search)/          # Search page (route group)
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── posts/         # Posts CRUD + likes/bookmarks/reposts
│   │   │   ├── users/         # User actions (follow)
│   │   │   ├── polls/         # Poll creation and voting
│   │   │   ├── search/        # Search endpoint
│   │   │   ├── trending/      # Trending hashtags
│   │   │   ├── notifications/ # Notifications list
│   │   │   └── register/      # User registration
│   │   ├── bookmarks/         # Bookmarks page (explicit route)
│   │   ├── compose/           # Compose post page
│   │   ├── feed/              # Feed page (explicit route)
│   │   ├── notifications/     # Notifications page
│   │   ├── post/[id]/         # Post thread page
│   │   ├── search/            # Search page (explicit route)
│   │   ├── trending/          # Trending page
│   │   ├── u/[username]/      # User profile page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Client providers (SessionProvider)
│   ├── components/
│   │   ├── Card.tsx           # Reusable card component
│   │   ├── Nav.tsx            # Navigation bar
│   │   └── PostCard.tsx       # Post card with actions
│   └── lib/
│       ├── authOptions.ts     # NextAuth configuration
│       ├── db.ts              # Prisma client singleton
│       └── session.ts         # Session helpers
├── docker-compose.yml         # PostgreSQL service
├── package.json
└── README.md
```

## Database Schema

### Core Models
- **User**: User accounts with credentials and profiles
- **Post**: Posts with content, replies, quotes
- **Comment**: Nested comments on posts
- **Like**: User likes on posts
- **Follow**: User follow relationships
- **Bookmark**: Saved posts
- **Repost**: Shared posts

### Advanced Models
- **Hashtag**: Extracted hashtags
- **PostHashtag**: Many-to-many hashtags ↔ posts
- **Mention**: User mentions in posts
- **Poll**: Polls attached to posts
- **PollOption**: Poll choices
- **Vote**: User votes on poll options
- **Notification**: Activity notifications
- **Media**: Uploaded images/videos (schema ready)

### NextAuth Models
- **Account**: OAuth accounts
- **Session**: User sessions
- **VerificationToken**: Email verification

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/auth/callback/credentials` - Login

### Posts
- `GET /api/posts` - List posts (cursor pagination)
- `POST /api/posts` - Create post (hashtag extraction)
- `POST /api/posts/[id]/like` - Like post
- `DELETE /api/posts/[id]/like` - Unlike post
- `POST /api/posts/[id]/bookmark` - Bookmark post
- `DELETE /api/posts/[id]/bookmark` - Remove bookmark
- `POST /api/posts/[id]/repost` - Repost
- `DELETE /api/posts/[id]/repost` - Undo repost
- `POST /api/posts/[id]/quote` - Quote post
- `GET /api/posts/[id]/comments` - List comments
- `POST /api/posts/[id]/comments` - Add comment

### Users
- `POST /api/users/[id]/follow` - Follow user
- `DELETE /api/users/[id]/follow` - Unfollow user

### Polls
- `POST /api/polls` - Create poll
- `POST /api/polls/[id]/vote` - Vote on poll

### Discovery
- `GET /api/search?q={query}` - Search users and posts
- `GET /api/trending` - Trending hashtags

### Notifications
- `GET /api/notifications` - List notifications

## Scalability Features

- **Cursor-based pagination**: Efficient infinite scroll
- **Indexed queries**: Optimized database indexes on hot paths
- **PostgreSQL**: Production-ready RDBMS with ACID guarantees
- **Prisma**: Type-safe queries with connection pooling
- **Stateless API**: Horizontal scaling ready
- **Session storage**: Database-backed sessions (can migrate to Redis)
- **Docker**: Containerized database for consistent environments

## Future Enhancements

- [ ] Media uploads (S3/CDN integration)
- [ ] Real-time updates (WebSockets/Server-Sent Events)
- [ ] Dark mode theme
- [ ] Direct messages
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Rate limiting (Redis-backed)
- [ ] Caching layer (Redis)
- [ ] Background jobs (Bull/BullMQ)
- [ ] Image optimization and CDN
- [ ] Video uploads
- [ ] Stories/Ephemeral posts
- [ ] Verified accounts
- [ ] Two-factor authentication

## Production Setup Guide

### Email Configuration (Nodemailer)

Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@blabla.com
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

### AWS SNS Configuration (SMS)

1. Create IAM user with SNS permissions
2. Get Access Key ID and Secret Access Key
3. Add to `.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_SNS_SENDER_ID=blabla
```

### AWS S3 Configuration (Media Storage)

1. Create S3 bucket (e.g., `blabla-media`)
2. Set bucket policy for public read access:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::blabla-media/*"
  }]
}
```
3. Add to `.env`:
```env
AWS_S3_BUCKET=blabla-media
AWS_S3_REGION=us-east-1
AWS_S3_PUBLIC_URL=https://blabla-media.s3.amazonaws.com
```

### IAM Policy for S3 + SNS

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::blabla-media/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": "*"
    }
  ]
}
```

## License

MIT

## Contributing

This is a demonstration project. Feel free to fork and extend!