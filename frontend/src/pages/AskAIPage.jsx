import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ChatInterface from '../components/ai/ChatInterface'
import { aiAPI } from '../services/api'
import './AskAIPage.css'

const AskAIPage = () => {
  const [error, setError] = useState(null)

  const handleSendMessage = async (message, setMessages, messages) => {
    try {
      setError(null)
      
      // Send question to backend AI API
      const response = await aiAPI.askQuestion(message)
      
      if (response.data.success && response.data.answer) {
        // Activity logging is automatically handled by backend when AI question is asked
        return response.data.answer
      } else {
        throw new Error('Failed to get AI response')
      }
    } catch (err) {
      console.error('Error asking AI:', err)
      setError(err.response?.data?.error || 'Failed to get AI response. Please try again.')
      throw err
    }
  }

  return (
    <div className="ask-ai-page">
      <Navbar />
      <div className="ask-ai-container">
        <div className="ask-ai-header">
          <h1 className="ask-ai-title">Ask AI</h1>
          <p className="ask-ai-subtitle">
            Get instant answers to your learning questions. Our AI assistant is here to help!
          </p>
        </div>
        {error && <div className="ask-ai-error">{error}</div>}
        <ChatInterface onSendMessage={handleSendMessage} />
      </div>
      <Footer />
    </div>
  )
}

export default AskAIPage

