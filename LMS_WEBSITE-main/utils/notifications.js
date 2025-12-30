import admin from 'firebase-admin';

/**
 * Sends Firebase Cloud Messaging notifications
 * Accepts title, body, and array of FCM tokens
 */
export const sendFCMNotification = async (title, body, tokens) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.log('No FCM tokens provided');
      return { success: false, message: 'No tokens provided' };
    }

    const message = {
      notification: {
        title,
        body,
      },
      tokens: Array.isArray(tokens) ? tokens : [tokens],
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    console.log(`Successfully sent ${response.successCount} notifications`);
    
    if (response.failureCount > 0) {
      console.log(`Failed to send ${response.failureCount} notifications`);
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('FCM notification error:', error.message);
    return { success: false, message: error.message };
  }
};

