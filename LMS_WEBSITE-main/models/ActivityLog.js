import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
  },
  actionType: {
    type: String,
    enum: ['VIDEO_VIEW', 'NOTES_READ', 'AI_ASK', 'COMMUNITY_POST'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index for efficient date-based queries
activityLogSchema.index({ userId: 1, timestamp: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);

