import './MessageBubble.css'

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user'

  return (
    <div className={`message-bubble ${isUser ? 'message-bubble-user' : 'message-bubble-ai'}`}>
      <div className="message-bubble-content">
        <p>{message.text}</p>
        <span className="message-bubble-time">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default MessageBubble

