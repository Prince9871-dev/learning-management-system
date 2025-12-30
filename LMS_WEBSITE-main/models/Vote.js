import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true,
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one vote per user per post
voteSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);

