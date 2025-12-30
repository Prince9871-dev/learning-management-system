import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import VideoPlayer from '../components/course/VideoPlayer'
import './CourseDetailPage.css'

const CourseDetailPage = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentVideo, setCurrentVideo] = useState(null)

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const mockCourse = {
      id: id,
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React and build your first application. This comprehensive course covers everything from basic concepts to advanced patterns.',
      instructor: 'John Doe',
      category: 'Web Development',
      rating: 4.5,
      duration: '10h 30m',
      students: 1250,
      lessons: [
        {
          id: '1',
          title: 'Getting Started with React',
          duration: '15:30',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
          id: '2',
          title: 'Components and Props',
          duration: '22:45',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        },
        {
          id: '3',
          title: 'State Management',
          duration: '18:20',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
      ],
    }

    setTimeout(() => {
      setCourse(mockCourse)
      setCurrentVideo(mockCourse.lessons[0])
      setLoading(false)
    }, 500)
  }, [id])

  const handleVideoProgress = (currentTime, duration) => {
    // In real app, this would save progress to backend
    console.log(`Progress: ${((currentTime / duration) * 100).toFixed(2)}%`)
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
            <div className="course-detail-meta">
              <span>By {course.instructor}</span>
              <span>⭐ {course.rating}</span>
              <span>👥 {course.students} students</span>
              <span>⏱ {course.duration}</span>
            </div>
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
            <div className="course-detail-lessons-list">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`course-detail-lesson ${currentVideo?.id === lesson.id ? 'active' : ''}`}
                  onClick={() => setCurrentVideo(lesson)}
                >
                  <div className="course-detail-lesson-number">{index + 1}</div>
                  <div className="course-detail-lesson-info">
                    <div className="course-detail-lesson-title">{lesson.title}</div>
                    <div className="course-detail-lesson-duration">{lesson.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CourseDetailPage

