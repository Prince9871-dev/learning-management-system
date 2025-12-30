import User from '../models/User.js';

/**
 * Middleware that allows only admin users
 * Assumes req.user.uid is available (from verifyFirebaseToken)
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check failed:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

