import VoteButton from './VoteButton'
import './PostCard.css'

const PostCard = ({ post, onVote }) => {
  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-card-author">
          <div className="post-card-avatar">{post.author?.name?.charAt(0) || 'U'}</div>
          <div>
            <div className="post-card-author-name">{post.author?.name || 'Anonymous'}</div>
            <div className="post-card-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <div className="post-card-content">
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-body">{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="post-card-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="post-card-footer">
        <VoteButton
          upvotes={post.upvotes || 0}
          downvotes={post.downvotes || 0}
          userVote={post.userVote}
          onVote={(type) => onVote && onVote(post.id, type)}
        />
        <div className="post-card-comments">
          💬 {post.commentCount || 0} comments
        </div>
      </div>
    </div>
  )
}

export default PostCard

