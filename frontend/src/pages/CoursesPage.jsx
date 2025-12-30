import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CourseList from '../components/course/CourseList'
import './CoursesPage.css'

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const mockCourses = [
      {
        id: '1',
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React and build your first application.',
        instructor: 'John Doe',
        category: 'Web Development',
        rating: 4.5,
        duration: '10h 30m',
        thumbnail: null,
      },
      {
        id: '2',
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts and modern ES6+ features.',
        instructor: 'Jane Smith',
        category: 'Programming',
        rating: 4.8,
        duration: '15h 20m',
        thumbnail: null,
      },
      {
        id: '3',
        title: 'Full Stack Development',
        description: 'Build complete web applications from frontend to backend.',
        instructor: 'Mike Johnson',
        category: 'Web Development',
        rating: 4.7,
        duration: '25h 45m',
        thumbnail: null,
      },
      {
        id: '4',
        title: 'Data Structures & Algorithms',
        description: 'Master fundamental data structures and algorithms for technical interviews.',
        instructor: 'Sarah Williams',
        category: 'Computer Science',
        rating: 4.9,
        duration: '20h 15m',
        thumbnail: null,
      },
      {
        id: '5',
        title: 'UI/UX Design Principles',
        description: 'Learn design thinking and create beautiful user interfaces.',
        instructor: 'Emily Davis',
        category: 'Design',
        rating: 4.6,
        duration: '12h 30m',
        thumbnail: null,
      },
      {
        id: '6',
        title: 'Python for Data Science',
        description: 'Analyze data and build machine learning models with Python.',
        instructor: 'David Brown',
        category: 'Data Science',
        rating: 4.7,
        duration: '18h 40m',
        thumbnail: null,
      },
    ]

    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 500)
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
        ) : (
          <CourseList courses={filteredCourses} />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CoursesPage

