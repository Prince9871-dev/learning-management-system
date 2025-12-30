import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import PostForm from '../components/community/PostForm'
import PostCard from '../components/community/PostCard'
import { useAuth } from '../context/AuthContext'
import { communityAPI } from '../services/api'
import './CommunityPage.css'

const CommunityPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await communityAPI.getPosts()
        
        // Backend returns: { success: true, posts: [...] }
        if (response.data.success && response.data.posts) {
          // Map backend post format to frontend format
          const formattedPosts = response.data.posts.map(post => ({
            id: post._id || post.id,
            title: post.title,
            content: post.content,
            author: { name: post.authorUid || 'Anonymous', id: post.authorUid },
            createdAt: post.createdAt,
            upvotes: post.upvotes || 0,
            downvotes: post.downvotes || 0,
            commentCount: 0, // Backend doesn't provide comment count
            tags: [], // Backend doesn't provide tags
            userVote: null, // Would need to fetch user's vote separately
            link: post.link,
            highlighted: post.highlighted || false,
          }))
          setPosts(formattedPosts)
        } else {
          setError('Failed to load posts')
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err.response?.data?.error || 'Failed to load posts. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleCreatePost = async (postData) => {
    try {
      setError(null)
      const response = await communityAPI.createPost({
        title: postData.title,
        content: postData.content,
        link: postData.link || null,
      })
      
      if (response.data.success && response.data.post) {
        const newPost = response.data.post
        const formattedPost = {
          id: newPost._id || newPost.id,
          title: newPost.title,
          content: newPost.content,
          author: { name: user?.name || user?.email || 'Anonymous', id: user?.uid || user?.id },
          createdAt: newPost.createdAt,
          upvotes: newPost.upvotes || 0,
          downvotes: newPost.downvotes || 0,
          commentCount: 0,
          tags: [],
          userVote: null,
          link: newPost.link,
          highlighted: newPost.highlighted || false,
        }
        setPosts([formattedPost, ...posts])
      }
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err.response?.data?.error || 'Failed to create post. Please try again.')
    }
  }

  const handleVote = async (postId, voteType) => {
    try {
      const response = await communityAPI.vote(postId, voteType)
      
      if (response.data.success && response.data.post) {
        const updatedPost = response.data.post
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              upvotes: updatedPost.upvotes || 0,
              downvotes: updatedPost.downvotes || 0,
              highlighted: updatedPost.highlighted || false,
            }
          }
          return post
        }))
      }
    } catch (err) {
      console.error('Error voting:', err)
      setError(err.response?.data?.error || 'Failed to vote. Please try again.')
    }
  }

  return (
    <div className="community-page">
      <Navbar />
      <div className="community-container">
        <h1 className="community-title">Community</h1>
        <p className="community-subtitle">Share knowledge, ask questions, and connect with fellow learners</p>

        <PostForm onSubmit={handleCreatePost} />

        {error && <div className="community-error">{error}</div>}

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

