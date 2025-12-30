import express from 'express';
import CommunityPost from '../models/CommunityPost.js';
import Vote from '../models/Vote.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { sendFCMNotification } from '../utils/notifications.js';
import User from '../models/User.js';
import { logActivity } from '../utils/activity.js';

const router = express.Router();

const HIGHLIGHT_THRESHOLD = 10; // Upvotes needed to highlight

// POST /api/community - Create post
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, link } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = new CommunityPost({
      authorUid: req.user.uid,
      title,
      content,
      link: link || null,
    });

    await post.save();
    await logActivity(req.user.uid, null, 'COMMUNITY_POST');

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET /api/community - Get all posts
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/community/:postId/vote - Upvote or downvote
router.post('/:postId/vote', verifyFirebaseToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      userId: req.user.uid,
      postId: post._id,
    });

    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType === voteType) {
        return res.json({ success: true, message: 'Already voted' });
      }

      // Remove old vote count
      if (existingVote.voteType === 'upvote') {
        post.upvotes -= 1;
      } else {
        post.downvotes -= 1;
      }

      // Update vote type
      existingVote.voteType = voteType;
      await existingVote.save();
    } else {
      // Create new vote
      await Vote.create({
        userId: req.user.uid,
        postId: post._id,
        voteType,
      });
    }

    // Update vote counts
    if (voteType === 'upvote') {
      post.upvotes += 1;
    } else {
      post.downvotes += 1;
    }

    // Check if should highlight
    const shouldHighlight = post.upvotes >= HIGHLIGHT_THRESHOLD;
    const wasHighlighted = post.highlighted;
    post.highlighted = shouldHighlight;

    await post.save();

    // Notify admin if newly highlighted
    if (shouldHighlight && !wasHighlighted) {
      const admins = await User.find({ role: 'admin' });
      const adminTokens = admins
        .map((admin) => admin.fcmToken)
        .filter((token) => token);

      if (adminTokens.length > 0) {
        await sendFCMNotification(
          'Post Highlighted',
          `Post "${post.title}" has been highlighted`,
          adminTokens
        );
      }
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already voted on this post' });
    }
    console.error('Vote error:', error.message);
    res.status(500).json({ error: 'Failed to process vote' });
  }
});

export default router;

