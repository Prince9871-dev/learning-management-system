import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CourseList from '../components/course/CourseList'
import { courseAPI } from '../services/api'
import './CoursesPage.css'

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await courseAPI.getAll()
        
        // Backend returns: { success: true, courses: [...] }
        if (response.data.success && response.data.courses) {
          // Map backend course format to frontend format
          const formattedCourses = response.data.courses.map(course => ({
            id: course._id || course.id,
            title: course.title,
            description: course.description || '',
            instructor: 'Instructor', // Backend doesn't provide instructor
            category: 'Course', // Backend doesn't provide category
            rating: 0, // Backend doesn't provide rating
            duration: 'N/A', // Backend doesn't provide duration
            thumbnail: null,
            createdAt: course.createdAt,
            notesUrl: course.notesUrl,
          }))
          setCourses(formattedCourses)
        } else {
          setError('Failed to load courses')
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError(err.response?.data?.error || 'Failed to load courses. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="courses-page">
      <Navbar />
      <div className="courses-container">
        <div className="courses-header">
          <h1 className="courses-title">All Courses</h1>
          <div className="courses-search">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="courses-search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="courses-loading">Loading courses...</div>
        ) : error ? (
          <div className="courses-error">{error}</div>
        ) : (
          <CourseList courses={filteredCourses} />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CoursesPage

