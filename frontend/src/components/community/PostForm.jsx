import { useState } from 'react'
import './PostForm.css'

const PostForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const postData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    }

    onSubmit(postData)
    setTitle('')
    setContent('')
    setTags('')
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
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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

