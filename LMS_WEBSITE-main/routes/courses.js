import express from 'express';
import Course from '../models/Course.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { fetchPlaylistVideos } from '../utils/youtube.js';
import { sendFCMNotification } from '../utils/notifications.js';
import { logActivity } from '../utils/activity.js';

const router = express.Router();

// POST /api/courses - Create course (admin only)
router.post('/', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, playlistId, notesUrl } = req.body;

    if (!title || !playlistId) {
      return res.status(400).json({ error: 'Title and playlistId are required' });
    }

    const course = new Course({
      title,
      description: description || '',
      youtubePlaylistId: playlistId,
      notesUrl: notesUrl || '',
      createdBy: req.user.uid,
    });

    await course.save();

    // Trigger notification placeholder
    // In production, you'd fetch admin FCM tokens and notify
    console.log('Course created - notification trigger placeholder');

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Create course error:', error.message);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// GET /api/courses/:id - Get course content with videos
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Fetch videos from YouTube
    let videos = [];
    try {
      videos = await fetchPlaylistVideos(course.youtubePlaylistId);
    } catch (error) {
      console.error('Failed to fetch YouTube videos:', error.message);
      // Continue even if YouTube fetch fails
    }

    // Log activity
    await logActivity(req.user.uid, course._id, 'VIDEO_VIEW');

    res.json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        notesUrl: course.notesUrl,
        createdAt: course.createdAt,
      },
      videos,
    });
  } catch (error) {
    console.error('Get course error:', error.message);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// GET /api/courses - Get all courses
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('Get courses error:', error.message);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;

