import CourseCard from './CourseCard'
import './CourseList.css'

const CourseList = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="course-list-empty">
        <p>No courses available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export default CourseList

