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

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    const currentInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Show loading state
    const loadingMessage = {
      id: Date.now() + 1,
      text: 'Thinking...',
      sender: 'ai',
      timestamp: new Date(),
      loading: true,
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      // Call the onSendMessage callback which should return the AI response
      if (onSendMessage) {
        const aiResponse = await onSendMessage(currentInput, setMessages, messages)
        
        // Remove loading message and add actual response
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.loading)
          return [...withoutLoading, {
            id: Date.now() + 2,
            text: aiResponse,
            sender: 'ai',
            timestamp: new Date(),
          }]
        })
      } else {
        // Fallback if no callback provided
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.loading)
          return [...withoutLoading, {
            id: Date.now() + 2,
            text: 'I understand your question. Please configure the AI API.',
            sender: 'ai',
            timestamp: new Date(),
          }]
        })
      }
    } catch (error) {
      // Remove loading message and show error
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.loading)
        return [...withoutLoading, {
          id: Date.now() + 2,
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        }]
      })
    }
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

