/**
 * Simple API test script
 * Run: node test-api.js
 * 
 * Note: Replace YOUR_FIREBASE_TOKEN with actual token for full testing
 */

import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.FIREBASE_TOKEN || 'YOUR_FIREBASE_TOKEN';

// Helper function for API calls
const apiCall = async (method, endpoint, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

// Test functions
const tests = {
  healthCheck: async () => {
    console.log('\n1. Testing Health Check...');
    const result = await apiCall('GET', '/health');
    console.log(result);
  },

  getCourses: async () => {
    console.log('\n2. Testing Get Courses...');
    const result = await apiCall('GET', '/api/courses', null, {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    });
    console.log(result);
  },

  createPost: async () => {
    console.log('\n3. Testing Create Community Post...');
    const result = await apiCall(
      'POST',
      '/api/community',
      {
        title: 'Test Post',
        content: 'This is a test post from API test script',
      },
      {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      }
    );
    console.log(result);
  },

  getActivityHeatmap: async () => {
    console.log('\n4. Testing Get Activity Heatmap...');
    const result = await apiCall('GET', '/api/activity/heatmap', null, {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    });
    console.log(result);
  },

  getStreaks: async () => {
    console.log('\n5. Testing Get Learning Streaks...');
    const result = await apiCall('GET', '/api/activity/streaks', null, {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    });
    console.log(result);
  },

  askAI: async () => {
    console.log('\n6. Testing AI Ask...');
    const result = await apiCall(
      'POST',
      '/api/ai/ask',
      {
        question: 'What is JavaScript?',
      },
      {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      }
    );
    console.log(result);
  },
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting API Tests...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Auth Token: ${AUTH_TOKEN === 'YOUR_FIREBASE_TOKEN' ? 'NOT SET (using placeholder)' : 'SET'}`);

  await tests.healthCheck();
  
  if (AUTH_TOKEN !== 'YOUR_FIREBASE_TOKEN') {
    await tests.getCourses();
    await tests.createPost();
    await tests.getActivityHeatmap();
    await tests.getStreaks();
    await tests.askAI();
  } else {
    console.log('\n⚠️  Skipping authenticated tests - set FIREBASE_TOKEN env variable');
  }

  console.log('\n✅ Tests completed!');
};

runTests().catch(console.error);

