import { Link } from 'react-router-dom'
import './CourseCard.css'

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-card-image">
        <img src={course.thumbnail || '/placeholder-course.jpg'} alt={course.title} />
        <div className="course-card-badge">{course.category}</div>
      </div>
      <div className="course-card-content">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-description">{course.description}</p>
        <div className="course-card-meta">
          <span className="course-card-instructor">By {course.instructor}</span>
          <span className="course-card-rating">⭐ {course.rating || '4.5'}</span>
        </div>
        <div className="course-card-footer">
          <span className="course-card-duration">{course.duration || '10h 30m'}</span>
          <Link to={`/courses/${course.id}`} className="course-card-button">
            View Course
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard

