import ActivityLog from '../models/ActivityLog.js';

/**
 * Logs a study activity
 */
export const logActivity = async (userId, topicId, actionType) => {
  try {
    await ActivityLog.create({
      userId,
      topicId,
      actionType,
    });
  } catch (error) {
    console.error('Activity logging error:', error.message);
    // Don't throw - activity logging should not break the main flow
  }
};

