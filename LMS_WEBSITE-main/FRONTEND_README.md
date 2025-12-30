# Babua LMS Frontend Documentation

Complete guide for building the frontend with all pages, components, and API integrations.

## 📋 Table of Contents

1. [Tech Stack Recommendations](#tech-stack-recommendations)
2. [Project Structure](#project-structure)
3. [Firebase Client Setup](#firebase-client-setup)
4. [API Configuration](#api-configuration)
5. [Pages & Routes](#pages--routes)
6. [Components](#components)
7. [API Integration Examples](#api-integration-examples)
8. [State Management](#state-management)
9. [Authentication Flow](#authentication-flow)

---

## 🚀 Tech Stack Recommendations

- **Framework**: React.js / Next.js / Vue.js
- **Styling**: Tailwind CSS / Material-UI / Chakra UI
- **State Management**: Context API / Redux / Zustand
- **HTTP Client**: Axios / Fetch API
- **Routing**: React Router / Next.js Router
- **Firebase**: Firebase SDK v9+ (modular)
- **Charts**: Recharts / Chart.js (for analytics/heatmap)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── CourseDetailPage.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ActivityPage.jsx
│   │   ├── AskAIPage.jsx
│   │   ├── DonatePage.jsx
│   │   └── AdminDashboardPage.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── course/
│   │   │   ├── CourseCard.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   └── CourseList.jsx
│   │   ├── community/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── VoteButton.jsx
│   │   ├── activity/
│   │   │   ├── ActivityHeatmap.jsx
│   │   │   ├── StreakDisplay.jsx
│   │   │   └── ActivityStats.jsx
│   │   ├── ai/
│   │   │   ├── ChatInterface.jsx
│   │   │   └── MessageBubble.jsx
│   │   └── admin/
│   │       ├── AnalyticsCard.jsx
│   │       ├── CourseForm.jsx
│   │       └── UserManagement.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── auth.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   └── App.jsx
├── public/
└── package.json
```

---

## 🔥 Firebase Client Setup

### 1. Install Firebase SDK

```bash
npm install firebase
```

### 2. Create `src/services/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCfQ8r662E4Cc63pRYmgFTFDLPdI310rnQ",
  authDomain: "babualms.firebaseapp.com",
  projectId: "babualms",
  storageBucket: "babualms.firebasestorage.app",
  messagingSenderId: "463425878258",
  appId: "1:463425878258:web:d676c856247c8cf24bb86b",
  measurementId: "G-RHFKXTZ6JK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
```

---

## 🔌 API Configuration

### Create `src/services/api.js`

```javascript
import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
};

export const communityAPI = {
  getAll: () => api.get('/community'),
  create: (data) => api.post('/community', data),
  vote: (postId, voteType) => api.post(`/community/${postId}/vote`, { voteType }),
};

export const activityAPI = {
  getHeatmap: () => api.get('/activity/heatmap'),
  getStreaks: () => api.get('/activity/streaks'),
  logActivity: (data) => api.post('/activity/log', data),
};

export const aiAPI = {
  ask: (question, context) => api.post('/ai/ask', { question, context }),
};

export const paymentAPI = {
  createOrder: (amount, message) => api.post('/payments/create-order', { amount, message }),
  verify: (orderId, paymentId, signature) => 
    api.post('/payments/verify', { orderId, paymentId, signature }),
};

export const analyticsAPI = {
  getDAU: (days = 30) => api.get(`/analytics/dau?days=${days}`),
  getTopics: (limit = 10) => api.get(`/analytics/topics?limit=${limit}`),
  getDonations: () => api.get('/analytics/donations'),
  getTrending: (limit = 10) => api.get(`/analytics/trending?limit=${limit}`),
};

export default api;
```

---

## 📄 Pages & Routes

### 1. **HomePage** (`/`)
- Hero section
- Featured courses
- Recent community posts
- Quick stats (streaks, activity)

### 2. **LoginPage** (`/login`)
- Firebase email/password auth
- Google sign-in
- Redirect after login

### 3. **CoursesPage** (`/courses`)
- List all courses
- Search/filter
- Course cards grid

### 4. **CourseDetailPage** (`/courses/:id`)
- Course info
- YouTube video player
- Video list
- Notes link
- Mark as viewed

### 5. **CommunityPage** (`/community`)
- All posts list
- Create post button
- Filter by highlighted/trending

### 6. **PostDetailPage** (`/community/:id`)
- Full post content
- Upvote/downvote buttons
- Comments (if implemented)
- Author info

### 7. **ProfilePage** (`/profile`)
- User info
- Activity heatmap
- Learning streaks
- FCM token management

### 8. **ActivityPage** (`/activity`)
- Activity heatmap (GitHub style)
- Streak display
- Activity log history
- Stats cards

### 9. **AskAIPage** (`/ask-ai`)
- Chat interface
- Question input
- AI responses
- Context input (optional)

### 10. **DonatePage** (`/donate`)
- Amount input
- Message input (optional)
- Razorpay integration
- Payment status

### 11. **AdminDashboardPage** (`/admin`)
- Analytics overview
- Create course form
- User management
- Donation stats

---

## 🧩 Components

### Common Components

#### **Navbar.jsx**
```javascript
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/community">Community</Link>
      <Link to="/activity">Activity</Link>
      <Link to="/ask-ai">Ask AI</Link>
      
      {isAdmin && <Link to="/admin">Admin</Link>}
      
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

#### **LoadingSpinner.jsx**
```javascript
export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
```

#### **ErrorMessage.jsx**
```javascript
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
```

### Course Components

#### **CourseCard.jsx**
```javascript
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <Link to={`/courses/${course._id}`}>View Course</Link>
    </div>
  );
}
```

#### **VideoPlayer.jsx**
```javascript
import { useEffect } from 'react';
import { courseAPI, activityAPI } from '../services/api';

export default function VideoPlayer({ videoId, courseId }) {
  useEffect(() => {
    // Log video view activity
    if (courseId) {
      activityAPI.logActivity({
        topicId: courseId,
        actionType: 'VIDEO_VIEW',
      });
    }
  }, [videoId, courseId]);

  return (
    <div className="video-player">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
```

#### **CourseList.jsx**
```javascript
import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import CourseCard from './CourseCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      setCourses(response.data.courses);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCourses} />;

  return (
    <div className="course-list">
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}
```

### Community Components

#### **PostCard.jsx**
```javascript
import { Link } from 'react-router-dom';
import VoteButton from './VoteButton';

export default function PostCard({ post }) {
  return (
    <div className={`post-card ${post.highlighted ? 'highlighted' : ''}`}>
      <Link to={`/community/${post._id}`}>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 150)}...</p>
      </Link>
      <div className="post-meta">
        <VoteButton postId={post._id} upvotes={post.upvotes} downvotes={post.downvotes} />
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
```

#### **PostForm.jsx**
```javascript
import { useState } from 'react';
import { communityAPI } from '../services/api';

export default function PostForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await communityAPI.create({ title, content, link: link || null });
      setTitle('');
      setContent('');
      setLink('');
      onSuccess?.();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="Link (optional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
```

#### **VoteButton.jsx**
```javascript
import { useState } from 'react';
import { communityAPI } from '../services/api';

export default function VoteButton({ postId, upvotes, downvotes }) {
  const [votes, setVotes] = useState({ upvotes, downvotes });
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    setLoading(true);
    try {
      const response = await communityAPI.vote(postId, voteType);
      setVotes({
        upvotes: response.data.post.upvotes,
        downvotes: response.data.post.downvotes,
      });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-buttons">
      <button onClick={() => handleVote('upvote')} disabled={loading}>
        👍 {votes.upvotes}
      </button>
      <button onClick={() => handleVote('downvote')} disabled={loading}>
        👎 {votes.downvotes}
      </button>
    </div>
  );
}
```

### Activity Components

#### **ActivityHeatmap.jsx**
```javascript
import { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ActivityHeatmap() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await activityAPI.getHeatmap();
      setActivity(response.data.activity);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Render GitHub-style heatmap
  // Use a library like react-calendar-heatmap or build custom
  return (
    <div className="activity-heatmap">
      {/* Render heatmap grid */}
      {activity.map((day) => (
        <div
          key={day.date}
          className={`heatmap-day intensity-${Math.min(day.activityCount, 4)}`}
          title={`${day.date}: ${day.activityCount} activities`}
        />
      ))}
    </div>
  );
}
```

#### **StreakDisplay.jsx**
```javascript
import { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';

export default function StreakDisplay() {
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreaks();
  }, []);

  const fetchStreaks = async () => {
    try {
      const response = await activityAPI.getStreaks();
      setStreaks(response.data);
    } catch (error) {
      console.error('Failed to fetch streaks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="streak-display">
      <div className="streak-card">
        <h3>Current Streak</h3>
        <p className="streak-number">{streaks.currentStreak}</p>
        <span>days</span>
      </div>
      <div className="streak-card">
        <h3>Longest Streak</h3>
        <p className="streak-number">{streaks.longestStreak}</p>
        <span>days</span>
      </div>
    </div>
  );
}
```

### AI Components

#### **ChatInterface.jsx**
```javascript
import { useState } from 'react';
import { aiAPI, activityAPI } from '../services/api';
import MessageBubble from './MessageBubble';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await aiAPI.ask(question, context);
      const aiMessage = { type: 'ai', content: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);

      // Log AI ask activity
      await activityAPI.logActivity({
        actionType: 'AI_ASK',
      });
    } catch (error) {
      const errorMessage = { type: 'error', content: error.response?.data?.error || 'Failed to get answer' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {loading && <div className="loading">AI is thinking...</div>}
      </div>
      <form onSubmit={handleAsk}>
        <input
          type="text"
          placeholder="Context (optional)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Ask</button>
      </form>
    </div>
  );
}
```

#### **MessageBubble.jsx**
```javascript
export default function MessageBubble({ message }) {
  return (
    <div className={`message-bubble ${message.type}`}>
      <p>{message.content}</p>
    </div>
  );
}
```

### Admin Components

#### **AnalyticsCard.jsx**
```javascript
import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

export default function AnalyticsCard({ title, endpoint, params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await analyticsAPI[endpoint](params);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="analytics-card">
      <h3>{title}</h3>
      {/* Render data based on endpoint type */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

#### **CourseForm.jsx**
```javascript
import { useState } from 'react';
import { courseAPI } from '../services/api';

export default function CourseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    playlistId: '',
    notesUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await courseAPI.create(formData);
      setFormData({ title: '', description: '', playlistId: '', notesUrl: '' });
      onSuccess?.();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Course Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="YouTube Playlist ID"
        value={formData.playlistId}
        onChange={(e) => setFormData({ ...formData, playlistId: e.target.value })}
        required
      />
      <input
        type="url"
        placeholder="Notes URL"
        value={formData.notesUrl}
        onChange={(e) => setFormData({ ...formData, notesUrl: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
}
```

---

## 🔐 Authentication Context

### Create `src/context/AuthContext.jsx`

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Check if user is admin
        try {
          const token = await firebaseUser.getIdToken();
          // You can decode token or make API call to check role
          // For now, we'll check via API
          checkAdminRole(firebaseUser.uid);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkAdminRole = async (uid) => {
    // You might want to create an API endpoint to check user role
    // For now, this is a placeholder
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 💳 Razorpay Integration

### Install Razorpay

```bash
npm install razorpay
```

### Create `src/utils/razorpay.js`

```javascript
import { loadScript } from './helpers';

export const initializeRazorpay = async () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      reject('Failed to load Razorpay');
    };
    document.body.appendChild(script);
  });
};

export const openRazorpay = async (orderData, onSuccess, onError) => {
  const Razorpay = await initializeRazorpay();
  
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: 'Babua LMS',
    description: 'Donation',
    handler: onSuccess,
    prefill: {
      // Add user details if available
    },
    theme: {
      color: '#3399cc',
    },
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
  razorpay.on('payment.failed', onError);
};
```

### DonatePage Component

```javascript
import { useState } from 'react';
import { paymentAPI } from '../services/api';
import { openRazorpay } from '../utils/razorpay';
import crypto from 'crypto-js';

export default function DonatePage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderResponse = await paymentAPI.createOrder(
        parseFloat(amount),
        message
      );

      // Open Razorpay checkout
      await openRazorpay(
        orderResponse.data,
        async (response) => {
          // Verify payment
          try {
            const verifyResponse = await paymentAPI.verify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert('Payment successful!');
            setAmount('');
            setMessage('');
          } catch (error) {
            alert('Payment verification failed');
          }
        },
        (error) => {
          alert('Payment failed');
        }
      );
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate}>
      <input
        type="number"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
        required
      />
      <textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Donate'}
      </button>
    </form>
  );
}
```

---

## 📱 Page Examples

### CourseDetailPage.jsx

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI } from '../services/api';
import VideoPlayer from '../components/course/VideoPlayer';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.course);
      setVideos(response.data.videos);
      if (response.data.videos.length > 0) {
        setSelectedVideo(response.data.videos[0]);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-detail">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      
      {course.notesUrl && (
        <a href={course.notesUrl} target="_blank" rel="noopener noreferrer">
          View Notes
        </a>
      )}

      {selectedVideo && (
        <VideoPlayer videoId={selectedVideo.videoId} courseId={id} />
      )}

      <div className="video-list">
        <h2>Videos</h2>
        {videos.map((video) => (
          <div
            key={video.videoId}
            className={`video-item ${selectedVideo?.videoId === video.videoId ? 'active' : ''}`}
            onClick={() => setSelectedVideo(video)}
          >
            <img src={video.thumbnail} alt={video.title} />
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### AdminDashboardPage.jsx

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import AnalyticsCard from '../components/admin/AnalyticsCard';
import CourseForm from '../components/admin/CourseForm';

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [dau, topics, donations, trending] = await Promise.all([
        analyticsAPI.getDAU(30),
        analyticsAPI.getTopics(10),
        analyticsAPI.getDonations(),
        analyticsAPI.getTrending(10),
      ]);

      setStats({
        dau: dau.data,
        topics: topics.data,
        donations: donations.data,
        trending: trending.data,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <section>
        <h2>Create Course</h2>
        <CourseForm onSuccess={fetchStats} />
      </section>

      <section>
        <h2>Analytics</h2>
        <div className="stats-grid">
          <AnalyticsCard title="Daily Active Users" endpoint="getDAU" params={30} />
          <AnalyticsCard title="Top Topics" endpoint="getTopics" params={10} />
          <AnalyticsCard title="Donations" endpoint="getDonations" />
          <AnalyticsCard title="Trending Posts" endpoint="getTrending" params={10} />
        </div>
      </section>
    </div>
  );
}
```

---

## 🛣️ Routing Setup

### App.jsx Example

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import ActivityPage from './pages/ActivityPage';
import AskAIPage from './pages/AskAIPage';
import DonatePage from './pages/DonatePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}

// Admin Route Component
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/community/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
      
      <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/ask-ai" element={<ProtectedRoute><AskAIPage /></ProtectedRoute>} />
      <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />
      
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 📝 Environment Variables

Create `.env` in frontend:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key-id
```

---

## ✅ Checklist

### Pages to Create
- [ ] HomePage
- [ ] LoginPage
- [ ] CoursesPage
- [ ] CourseDetailPage
- [ ] CommunityPage
- [ ] PostDetailPage
- [ ] ProfilePage
- [ ] ActivityPage
- [ ] AskAIPage
- [ ] DonatePage
- [ ] AdminDashboardPage

### Components to Create
- [ ] Navbar
- [ ] Footer
- [ ] LoadingSpinner
- [ ] ErrorMessage
- [ ] CourseCard
- [ ] CourseList
- [ ] VideoPlayer
- [ ] PostCard
- [ ] PostForm
- [ ] VoteButton
- [ ] ActivityHeatmap
- [ ] StreakDisplay
- [ ] ChatInterface
- [ ] MessageBubble
- [ ] AnalyticsCard
- [ ] CourseForm

### Services to Create
- [ ] api.js (API client)
- [ ] firebase.js (Firebase config)
- [ ] auth.js (Auth helpers)

### Context to Create
- [ ] AuthContext

---

## 🎨 Styling Tips

1. Use Tailwind CSS for rapid development
2. Create a theme file for colors
3. Make components responsive
4. Add loading states everywhere
5. Handle errors gracefully
6. Use consistent spacing and typography

---

## 🚀 Getting Started

1. **Initialize project:**
   ```bash
   npx create-react-app babua-lms-frontend
   cd babua-lms-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install firebase react-router-dom axios
   npm install -D tailwindcss
   ```

3. **Set up Firebase** (use config from above)

4. **Create API service** (copy from above)

5. **Set up routing** (copy App.jsx from above)

6. **Start building pages** one by one

---

This documentation provides everything needed to build the frontend. Each component includes API integration examples and can be easily connected to your backend!

