import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { answerDoubt } from '../utils/gemini.js';
import { logActivity } from '../utils/activity.js';

const router = express.Router();

// POST /api/ai/ask - Ask AI a question
router.post('/ask', verifyFirebaseToken, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await answerDoubt(question, context || '');

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to get answer' });
    }

    // Log activity
    await logActivity(req.user.uid, null, 'AI_ASK');

    res.json({
      success: true,
      answer: result.answer,
    });
  } catch (error) {
    console.error('AI ask error:', error.message);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

export default router;

