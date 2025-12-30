# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
YOUTUBE_API_KEY=your-youtube-api-key
GEMINI_API_KEY=your-gemini-api-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

## 3. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 4. Test the API

### Health Check (No Auth Required)
```bash
curl http://localhost:3000/health
```

### Get Firebase Token

You'll need a Firebase ID token from your frontend app. To test:

1. Use Firebase Admin SDK to create a test token, OR
2. Use your frontend app to get a token, OR
3. Use Firebase CLI: `firebase auth:export users.json`

### Test Authenticated Endpoints

Replace `YOUR_FIREBASE_TOKEN` with actual token:

```bash
# Get all courses
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Create a course (Admin only)
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "description": "Test",
    "playlistId": "PLrAXtmRdnEQy6nuLMHOn6yhn7X0CAk0aB",
    "notesUrl": "https://example.com"
  }'
```

## 5. Run Test Script

```bash
# Set your Firebase token
export FIREBASE_TOKEN=your-token-here

# Run tests
npm test
```

## Common Issues

### MongoDB Connection Error
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is enabled

### Firebase Admin Error
- Verify FIREBASE_PRIVATE_KEY includes `\n` characters
- Check that the service account has proper permissions
- Ensure FIREBASE_PROJECT_ID matches your Firebase project

### YouTube API Error
- Verify API key is correct
- Check API quota limits
- Ensure YouTube Data API v3 is enabled

### Razorpay Error
- Verify key_id and key_secret
- Check if you're using test keys in test mode
- Ensure webhook URL is configured (if using webhooks)

## Next Steps

1. Create your first admin user in MongoDB:
```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  uid: "firebase-uid-here",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date()
})
```

2. Test all endpoints using the examples in README.md

3. Set up your frontend to connect to this backend

4. Configure FCM tokens for push notifications

