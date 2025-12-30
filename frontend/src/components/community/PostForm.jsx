import { useState } from 'react'
import './PostForm.css'

const PostForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const postData = {
      title: title.trim(),
      content: content.trim(),
      link: link.trim() || null,
    }

    onSubmit(postData)
    setTitle('')
    setContent('')
    setLink('')
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3 className="post-form-title">Create New Post</h3>
      <div className="post-form-group">
        <input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="post-form-input"
          required
        />
      </div>
      <div className="post-form-group">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="post-form-textarea"
          rows="5"
          required
        />
      </div>
      <div className="post-form-group">
        <input
          type="url"
          placeholder="Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="post-form-input"
        />
      </div>
      <button type="submit" className="post-form-button">
        Post
      </button>
    </form>
  )
}

export default PostForm

