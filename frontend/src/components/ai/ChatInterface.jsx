import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import './ChatInterface.css'

const ChatInterface = ({ onSendMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI learning assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: 'I understand your question. This is a mock response. In a real implementation, this would connect to an AI service.',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      if (onSendMessage) {
        onSendMessage(input)
      }
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-interface-header">
        <h3>AI Learning Assistant</h3>
      </div>
      <div className="chat-interface-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-interface-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your question..."
          className="chat-interface-input"
          rows="2"
        />
        <button onClick={handleSend} className="chat-interface-send">
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatInterface

