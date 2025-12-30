import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { logActivity } from '../utils/activity.js';

const router = express.Router();

// GET /api/activity/heatmap - Get daily activity for heatmap
router.get('/heatmap', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const activity = await ActivityLog.aggregate([
      {
        $match: {
          userId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          activityCount: { $sum: 1 },
        },
      },
      {
        $project: {
          date: '$_id',
          activityCount: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error('Heatmap error:', error.message);
    res.status(500).json({ error: 'Failed to fetch activity data' });
  }
});

// GET /api/activity/streaks - Get learning streaks
router.get('/streaks', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    // Get all activity dates
    const activities = await ActivityLog.aggregate([
      {
        $match: {
          userId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
        },
      },
      {
        $project: {
          date: '$_id',
          _id: 0,
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    const dates = activities.map((a) => new Date(a.date));
    dates.sort((a, b) => b - a); // Sort descending

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);
    for (const date of dates) {
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);

      if (dateOnly.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateOnly < checkDate) {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (prevDate - currDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    res.json({
      success: true,
      currentStreak,
      longestStreak,
    });
  } catch (error) {
    console.error('Streaks error:', error.message);
    res.status(500).json({ error: 'Failed to calculate streaks' });
  }
});

// POST /api/activity/log - Manually log activity (for testing)
router.post('/log', verifyFirebaseToken, async (req, res) => {
  try {
    const { topicId, actionType } = req.body;

    if (!actionType || !['VIDEO_VIEW', 'NOTES_READ', 'AI_ASK', 'COMMUNITY_POST'].includes(actionType)) {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    await logActivity(req.user.uid, topicId || null, actionType);

    res.json({
      success: true,
      message: 'Activity logged',
    });
  } catch (error) {
    console.error('Log activity error:', error.message);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

export default router;

