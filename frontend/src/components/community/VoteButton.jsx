import { useState } from 'react'
import './VoteButton.css'

const VoteButton = ({ upvotes = 0, downvotes = 0, userVote = null, onVote }) => {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes)
  const [localDownvotes, setLocalDownvotes] = useState(downvotes)
  const [localUserVote, setLocalUserVote] = useState(userVote)

  const handleVote = (type) => {
    if (!onVote) return

    if (localUserVote === type) {
      // Undo vote
      if (type === 'upvote') {
        setLocalUpvotes(localUpvotes - 1)
      } else {
        setLocalDownvotes(localDownvotes - 1)
      }
      setLocalUserVote(null)
    } else {
      // Change vote
      if (localUserVote === 'upvote') {
        setLocalUpvotes(localUpvotes - 1)
      } else if (localUserVote === 'downvote') {
        setLocalDownvotes(localDownvotes - 1)
      }

      if (type === 'upvote') {
        setLocalUpvotes(localUpvotes + 1)
      } else {
        setLocalDownvotes(localDownvotes + 1)
      }
      setLocalUserVote(type)
    }

    onVote(type)
  }

  return (
    <div className="vote-button">
      <button
        className={`vote-button-up ${localUserVote === 'upvote' ? 'active' : ''}`}
        onClick={() => handleVote('upvote')}
      >
        ▲ {localUpvotes}
      </button>
      <button
        className={`vote-button-down ${localUserVote === 'downvote' ? 'active' : ''}`}
        onClick={() => handleVote('downvote')}
      >
        ▼ {localDownvotes}
      </button>
    </div>
  )
}

export default VoteButton

