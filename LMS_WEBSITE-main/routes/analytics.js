import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import Course from '../models/Course.js';
import CommunityPost from '../models/CommunityPost.js';
import Donation from '../models/Donation.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// All analytics routes require admin access
router.use(verifyFirebaseToken, requireAdmin);

// GET /api/analytics/dau - Daily Active Users
router.get('/dau', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const dau = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          date: '$_id',
          count: { $size: '$uniqueUsers' },
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json({
      success: true,
      dau,
    });
  } catch (error) {
    console.error('DAU analytics error:', error.message);
    res.status(500).json({ error: 'Failed to fetch DAU' });
  }
});

// GET /api/analytics/topics - Most studied topics
router.get('/topics', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topics = await ActivityLog.aggregate([
      {
        $match: {
          topicId: { $ne: null },
          actionType: { $in: ['VIDEO_VIEW', 'NOTES_READ'] },
        },
      },
      {
        $group: {
          _id: '$topicId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $project: {
          topicId: '$_id',
          title: '$course.title',
          studyCount: '$count',
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      topics,
    });
  } catch (error) {
    console.error('Topics analytics error:', error.message);
    res.status(500).json({ error: 'Failed to fetch topics analytics' });
  }
});

// GET /api/analytics/donations - Total donations
router.get('/donations', async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      {
        $match: {
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    const result = stats[0] || { totalAmount: 0, totalCount: 0 };

    res.json({
      success: true,
      totalAmount: result.totalAmount,
      totalCount: result.totalCount,
    });
  } catch (error) {
    console.error('Donations analytics error:', error.message);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// GET /api/analytics/trending - Trending community posts
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const posts = await CommunityPost.find()
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Trending posts error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});

export default router;

