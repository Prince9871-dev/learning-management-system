import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import PostForm from '../components/community/PostForm'
import PostCard from '../components/community/PostCard'
import { useAuth } from '../context/AuthContext'
import './CommunityPage.css'

const CommunityPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const mockPosts = [
      {
        id: '1',
        title: 'Best practices for React hooks?',
        content: 'I\'m new to React hooks and wondering what are some best practices I should follow. Any tips?',
        author: { name: 'Alice Johnson', id: '1' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        upvotes: 15,
        downvotes: 2,
        commentCount: 8,
        tags: ['react', 'hooks', 'help'],
        userVote: null,
      },
      {
        id: '2',
        title: 'Sharing my learning journey',
        content: 'Just completed the Full Stack Development course! It was amazing. Here\'s what I learned...',
        author: { name: 'Bob Smith', id: '2' },
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        upvotes: 32,
        downvotes: 1,
        commentCount: 12,
        tags: ['journey', 'fullstack'],
        userVote: 'upvote',
      },
      {
        id: '3',
        title: 'Need help with async/await',
        content: 'Can someone explain the difference between async/await and promises? I\'m confused.',
        author: { name: 'Charlie Brown', id: '3' },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        upvotes: 8,
        downvotes: 0,
        commentCount: 5,
        tags: ['javascript', 'async', 'help'],
        userVote: null,
      },
    ]

    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 500)
  }, [])

  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      author: { name: user?.name || 'Anonymous', id: user?.id },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      userVote: null,
    }
    setPosts([newPost, ...posts])
  }

  const handleVote = (postId, voteType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        let newUpvotes = post.upvotes
        let newDownvotes = post.downvotes
        let newUserVote = voteType

        if (post.userVote === voteType) {
          // Undo vote
          if (voteType === 'upvote') {
            newUpvotes--
          } else {
            newDownvotes--
          }
          newUserVote = null
        } else {
          // Change vote
          if (post.userVote === 'upvote') {
            newUpvotes--
          } else if (post.userVote === 'downvote') {
            newDownvotes--
          }

          if (voteType === 'upvote') {
            newUpvotes++
          } else {
            newDownvotes++
          }
        }

        return {
          ...post,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote,
        }
      }
      return post
    }))
  }

  return (
    <div className="community-page">
      <Navbar />
      <div className="community-container">
        <h1 className="community-title">Community</h1>
        <p className="community-subtitle">Share knowledge, ask questions, and connect with fellow learners</p>

        <PostForm onSubmit={handleCreatePost} />

        {loading ? (
          <div className="community-loading">Loading posts...</div>
        ) : (
          <div className="community-posts">
            {posts.length === 0 ? (
              <div className="community-empty">No posts yet. Be the first to post!</div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onVote={handleVote} />
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CommunityPage

