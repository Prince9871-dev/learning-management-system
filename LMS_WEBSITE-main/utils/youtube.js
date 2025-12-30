import axios from 'axios';

/**
 * Fetches videos from a YouTube playlist using YouTube Data API v3
 * Returns array of { videoId, title, thumbnail }
 */
export const fetchPlaylistVideos = async (playlistId) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50,
        key: API_KEY,
      },
    });

    const videos = response.data.items.map((item) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    }));

    return videos;
  } catch (error) {
    console.error('YouTube API error:', error.message);
    if (error.response) {
      throw new Error(`YouTube API error: ${error.response.data.error?.message || 'Unknown error'}`);
    }
    throw error;
  }
};

