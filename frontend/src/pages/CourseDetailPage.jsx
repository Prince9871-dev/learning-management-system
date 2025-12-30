import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import VideoPlayer from '../components/course/VideoPlayer'
import { courseAPI, activityAPI } from '../services/api'
import './CourseDetailPage.css'

const CourseDetailPage = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [hasLoggedActivity, setHasLoggedActivity] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await courseAPI.getById(id)
        
        // Backend returns: { success: true, course: {...}, videos: [...] }
        if (response.data.success) {
          const courseData = response.data.course
          const videosData = response.data.videos || []
          
          setCourse({
            id: courseData.id || courseData._id,
            title: courseData.title,
            description: courseData.description || '',
            notesUrl: courseData.notesUrl,
            createdAt: courseData.createdAt,
          })
          
          // Map YouTube videos to frontend format
          const formattedVideos = videosData.map((video, index) => ({
            id: video.videoId || index.toString(),
            title: video.title || `Video ${index + 1}`,
            duration: video.duration || 'N/A',
            videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
            thumbnail: video.thumbnail,
          }))
          
          setVideos(formattedVideos)
          if (formattedVideos.length > 0) {
            setCurrentVideo(formattedVideos[0])
          }
        } else {
          setError('Failed to load course')
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError(err.response?.data?.error || 'Failed to load course. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourse()
    }
  }, [id])

  // Log activity when video is watched
  useEffect(() => {
    const logVideoActivity = async () => {
      if (currentVideo && !hasLoggedActivity) {
        try {
          await activityAPI.logActivity(id, 'VIDEO_VIEW')
          setHasLoggedActivity(true)
        } catch (err) {
          console.error('Error logging video activity:', err)
          // Don't show error to user, just log it
        }
      }
    }

    logVideoActivity()
  }, [currentVideo, id, hasLoggedActivity])

  const handleVideoProgress = (currentTime, duration) => {
    // Progress tracking can be added here if needed
    // For now, activity is logged when video is viewed
  }

  if (loading) {
    return (
      <div className="course-detail-page">
        <Navbar />
        <div className="course-detail-loading">Loading course...</div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="course-detail-page">
        <Navbar />
        <div className="course-detail-error">{error}</div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="course-detail-page">
        <Navbar />
        <div className="course-detail-error">Course not found</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="course-detail-page">
      <Navbar />
      <div className="course-detail-container">
        <div className="course-detail-main">
          <div className="course-detail-header">
            <h1 className="course-detail-title">{course.title}</h1>
            {course.notesUrl && (
              <div className="course-detail-meta">
                <a href={course.notesUrl} target="_blank" rel="noopener noreferrer" className="course-notes-link">
                  📝 View Notes
                </a>
              </div>
            )}
          </div>

          <div className="course-detail-video-section">
            {currentVideo && (
              <VideoPlayer
                videoUrl={currentVideo.videoUrl}
                title={currentVideo.title}
                onProgress={handleVideoProgress}
              />
            )}
          </div>

          <div className="course-detail-description">
            <h2>About this course</h2>
            <p>{course.description}</p>
          </div>
        </div>

        <div className="course-detail-sidebar">
          <div className="course-detail-lessons">
            <h3>Course Content</h3>
            {videos.length === 0 ? (
              <div className="course-detail-no-videos">No videos available</div>
            ) : (
              <div className="course-detail-lessons-list">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`course-detail-lesson ${currentVideo?.id === video.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentVideo(video)
                      setHasLoggedActivity(false) // Reset to log activity for new video
                    }}
                  >
                    <div className="course-detail-lesson-number">{index + 1}</div>
                    <div className="course-detail-lesson-info">
                      <div className="course-detail-lesson-title">{video.title}</div>
                      <div className="course-detail-lesson-duration">{video.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CourseDetailPage

