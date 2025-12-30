# Babua LMS Backend

A comprehensive Learning Management System backend built with Node.js, Express, and MongoDB. Features Firebase authentication, YouTube integration, AI-powered doubt resolution, community features, and ethical monetization.

## 🚀 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Admin SDK
- **APIs**: YouTube Data API v3, Google Gemini API
- **Payments**: Razorpay
- **Notifications**: Firebase Cloud Messaging

## 📋 Architecture

```
┌─────────────────┐
│   Express App   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│MongoDB│ │Firebase│
└───────┘ └───────┘
```

### Key Components

- **Middleware**: Firebase token verification, admin authorization
- **Models**: User, Course, CommunityPost, Vote, ActivityLog, Donation
- **Routes**: Courses, Community, Activity, AI, Payments, Analytics
- **Utils**: YouTube API, Gemini AI, FCM notifications

## ✨ Features

### 1. Authentication & Authorization
- Firebase ID token verification
- Role-based access control (user/admin)
- Secure middleware for protected routes

### 2. Course Management
- Admin can create courses with YouTube playlists
- Fetch course content with video metadata
- Notes URL support for each course

### 3. Community Features
- Create and view community posts
- Upvote/downvote system (one vote per user)
- Auto-highlighting of popular posts
- Admin notifications for highlighted posts

### 4. Study Activity Tracking
- Logs: VIDEO_VIEW, NOTES_READ, AI_ASK, COMMUNITY_POST
- Daily activity heatmap (GitHub/LeetCode style)
- Learning streaks calculation
- Scalable activity logging

### 5. AI-Powered Doubt Resolution
- Google Gemini Flash integration
- Hints-only approach (no full code solutions)
- Interview-friendly explanations
- Context-aware responses

### 6. Ethical Monetization
- One-time donations via Razorpay
- Superchat messages support
- Secure payment verification
- Transparent donation tracking

### 7. Admin Analytics
- Daily Active Users (DAU)
- Most studied topics
- Total donations tracking
- Trending community posts

## 📡 API Overview

### Authentication
All protected routes require `Authorization: Bearer <firebase-token>` header.

### Courses

#### `POST /api/courses` (Admin only)
Create a new course.

**Request:**
```json
{
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "playlistId": "PLrAXtmRdnEQy6nuLMHOn6yhn7X0CAk0aB",
  "notesUrl": "https://example.com/notes"
}
```

**Response:**
```json
{
  "success": true,
  "course": { ... }
}
```

#### `GET /api/courses`
Get all courses.

#### `GET /api/courses/:id`
Get course with YouTube videos.

**Response:**
```json
{
  "success": true,
  "course": { ... },
  "videos": [
    {
      "videoId": "...",
      "title": "...",
      "thumbnail": "..."
    }
  ]
}
```

### Community

#### `POST /api/community`
Create a community post.

**Request:**
```json
{
  "title": "Help with React Hooks",
  "content": "I'm stuck on...",
  "link": "https://example.com" // optional
}
```

#### `GET /api/community`
Get all community posts.

#### `POST /api/community/:postId/vote`
Upvote or downvote a post.

**Request:**
```json
{
  "voteType": "upvote" // or "downvote"
}
```

### Activity

#### `GET /api/activity/heatmap`
Get daily activity data for heatmap (last 365 days).

**Response:**
```json
{
  "success": true,
  "activity": [
    {
      "date": "2024-01-15",
      "activityCount": 5
    }
  ]
}
```

#### `GET /api/activity/streaks`
Get learning streaks.

**Response:**
```json
{
  "success": true,
  "currentStreak": 7,
  "longestStreak": 30
}
```

### AI

#### `POST /api/ai/ask`
Ask AI a question.

**Request:**
```json
{
  "question": "How does React useState work?",
  "context": "I'm learning React hooks" // optional
}
```

**Response:**
```json
{
  "success": true,
  "answer": "React useState is a hook that..."
}
```

### Payments

#### `POST /api/payments/create-order`
Create Razorpay order.

**Request:**
```json
{
  "amount": 100, // in INR
  "message": "Thanks for the great content!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xxx",
  "amount": 10000, // in paise
  "currency": "INR"
}
```

#### `POST /api/payments/verify`
Verify payment signature.

**Request:**
```json
{
  "orderId": "order_xxx",
  "paymentId": "pay_xxx",
  "signature": "signature_xxx"
}
```

### Analytics (Admin only)

#### `GET /api/analytics/dau?days=30`
Get Daily Active Users.

#### `GET /api/analytics/topics?limit=10`
Get most studied topics.

#### `GET /api/analytics/donations`
Get total donations.

#### `GET /api/analytics/trending?limit=10`
Get trending community posts.

## 💰 Ethical Monetization

This LMS implements ethical monetization through:

1. **Voluntary Donations**: Users can support the platform through one-time donations
2. **Superchat Messages**: Optional messages with donations for community engagement
3. **No Paywalls**: All educational content remains free and accessible
4. **Transparency**: All donations are tracked and visible to admins
5. **No Ads**: Clean, ad-free learning experience

Monetization is designed to support platform maintenance and development without compromising educational access.

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Firebase project with Admin SDK
- YouTube Data API key
- Google Gemini API key
- Razorpay account (for payments)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Create `.env` file** (copy from `.env.example` and fill in your values):


3. **Start the server:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. **Verify server is running:**
```bash
curl http://localhost:3000/health
```

## 🧪 Testing APIs

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Create Course (Admin)
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "description": "Test description",
    "playlistId": "PLrAXtmRdnEQy6nuLMHOn6yhn7X0CAk0aB",
    "notesUrl": "https://example.com/notes"
  }'
```

### 3. Get Courses
```bash
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 4. Get Course with Videos
```bash
curl -X GET http://localhost:3000/api/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 5. Create Community Post
```bash
curl -X POST http://localhost:3000/api/community \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post"
  }'
```

### 6. Vote on Post
```bash
curl -X POST http://localhost:3000/api/community/POST_ID/vote \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "voteType": "upvote"
  }'
```

### 7. Get Activity Heatmap
```bash
curl -X GET http://localhost:3000/api/activity/heatmap \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 8. Get Learning Streaks
```bash
curl -X GET http://localhost:3000/api/activity/streaks \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### 9. Ask AI
```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is React?",
    "context": "Learning frontend development"
  }'
```

### 10. Create Payment Order
```bash
curl -X POST http://localhost:3000/api/payments/create-order \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "message": "Thanks!"
  }'
```

### 11. Get Analytics (Admin)
```bash
curl -X GET http://localhost:3000/api/analytics/dau?days=30 \
  -H "Authorization: Bearer YOUR_FIREBASE_ADMIN_TOKEN"
```

## 📁 Project Structure

```
babua-lms/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   ├── auth.js            # Firebase token verification
│   └── admin.js           # Admin authorization
├── models/
│   ├── User.js            # User schema
│   ├── Course.js          # Course schema
│   ├── CommunityPost.js   # Post schema
│   ├── Vote.js            # Vote schema
│   ├── ActivityLog.js     # Activity log schema
│   └── Donation.js        # Donation schema
├── routes/
│   ├── courses.js         # Course routes
│   ├── community.js       # Community routes
│   ├── activity.js        # Activity routes
│   ├── ai.js              # AI routes
│   ├── payments.js        # Payment routes
│   └── analytics.js       # Analytics routes
├── utils/
│   ├── youtube.js         # YouTube API
│   ├── gemini.js          # Gemini AI
│   ├── notifications.js   # FCM notifications
│   └── activity.js        # Activity logging
├── server.js              # Express app entry
├── package.json
├── .env.example
└── README.md
```

## 🔒 Security Notes

- All sensitive data stored in environment variables
- Firebase token verification on protected routes
- Razorpay signature verification for payments
- MongoDB connection string secured
- Admin routes protected with role checks

## 📝 License

ISC

## 🤝 Contributing

This is a hackathon project. Keep code simple, readable, and maintainable.

---

**Built with ❤️ for education**

