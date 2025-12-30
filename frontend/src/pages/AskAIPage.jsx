import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ChatInterface from '../components/ai/ChatInterface'
import './AskAIPage.css'

const AskAIPage = () => {
  const handleSendMessage = (message) => {
    // In real app, this would send to AI API
    console.log('Sending message to AI:', message)
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
        <ChatInterface onSendMessage={handleSendMessage} />
      </div>
      <Footer />
    </div>
  )
}

export default AskAIPage

