# Babua LMS Frontend

A Learning Management System (LMS) frontend built with React, featuring course browsing, community interaction, activity tracking, and AI-powered assistance.

## Features

- 🎓 **Course Management**: Browse and watch video-based courses
- 👥 **Community**: Post questions, share knowledge, and interact with upvotes/downvotes
- 📊 **Activity Tracking**: View learning streaks and activity heatmap
- 🤖 **AI Assistant**: Ask questions and get instant answers (UI only)
- 👨‍💼 **Admin Dashboard**: Analytics and platform management (UI skeleton)

## Tech Stack

- **React** (Vite)
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **JavaScript** (no TypeScript)

## Project Structure

```
src/
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── CoursesPage.jsx
│   ├── CourseDetailPage.jsx
│   ├── CommunityPage.jsx
│   ├── AskAIPage.jsx
│   ├── ActivityPage.jsx
│   ├── ProfilePage.jsx
│   └── AdminDashboardPage.jsx
├── components/         # Reusable components
│   ├── common/        # Navbar, Footer, ProtectedRoute
│   ├── course/        # CourseCard, CourseList, VideoPlayer
│   ├── community/     # PostCard, PostForm, VoteButton
│   ├── activity/      # ActivityHeatmap, StreakDisplay
│   ├── ai/            # ChatInterface, MessageBubble
│   └── admin/         # AnalyticsCard
├── context/           # AuthContext
├── services/          # API service (api.js)
└── utils/             # Constants and utilities
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Authentication

Currently uses mock authentication with localStorage:
- Use any email and password to login
- Email containing "admin" grants admin access
- Auth state persists across page refreshes

## API Integration

The app is structured to easily integrate with a backend:
- All API calls are defined in `src/services/api.js`
- Axios interceptors handle token authentication
- API endpoints are organized by feature (courses, community, activity, AI, analytics)

## Protected Routes

All routes except `/` and `/login` are protected and require authentication.

## Notes

- This is a **frontend-only** implementation
- All data is currently mocked/dummy data
- No backend or Firebase integration
- Ready for backend API integration

## License

MIT

