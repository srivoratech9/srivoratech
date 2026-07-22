import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Sparkles, User, ArrowRight, CornerDownLeft } from 'lucide-react'
import './AIChatWidget.css'

const initialMessages = [
  {
    sender: 'ai',
    text: "Hi there! 👋 I'm SriVoraAI. How can I help you today? Ask me about our 2-week MVP sprints, tech stack, pricing, or IP ownership!",
  },
]

const quickPrompts = [
  '⚡ What is your turnaround time?',
  '💰 How much does a project cost?',
  '🛡️ Who owns the code & IP?',
  '🚀 How do we get started?',
]

const aiAnswers = {
  '⚡ What is your turnaround time?':
    'We build production-grade MVPs in 2–4 weeks! Full web applications take 6–8 weeks, with live staging updates every week.',
  '💰 How much does a project cost?':
    'Projects range from ₹50k for specialized MVPs up to ₹5L–10L+ for enterprise ERPs & platforms. Try our 60s Project Estimator tool above for a custom quote!',
  '🛡️ Who owns the code & IP?':
    'You retain 100% full copyright ownership of all source code, Figma design systems, credentials, and IP rights upon completion.',
  '🚀 How do we get started?':
    'Simply click "Book a Call" to reserve a 30-minute discovery session with our technical lead, or send us your scope details via our contact form!',
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, isTyping])

  const handleSend = (textToSend) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg = { sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')

    setIsTyping(true)

    setTimeout(() => {
      let aiText = aiAnswers[text] ||
        "Thanks for your question! We specialize in high-speed React, Next.js 14, Python AI, and mobile app engineering. Would you like to book a 30-minute discovery call or estimate your project?"

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }])
      setIsTyping(false)
    }, 150)
  }

  return (
    <div className="ai-chat-container">
      {isOpen && (
        <div className="ai-chat-window animate-pop">
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar-badge">
                <Bot size={18} />
              </div>
              <div className="ai-header-text">
                <strong>SriVoraAI Assistant</strong>
                <span className="online-status">● Always Active</span>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)} aria-label="Close AI chat">
              <X size={16} />
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-row ${m.sender === 'user' ? 'row-user' : 'row-ai'}`}>
                <div className={`chat-bubble-ai ${m.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-row row-ai">
                <div className="chat-bubble-ai bubble-ai typing-bubble">
                  <span className="dot-typing" />
                  <span className="dot-typing" />
                  <span className="dot-typing" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="ai-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                className="prompt-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <input
              type="text"
              placeholder="Ask SriVoraAI a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="ai-send-btn" disabled={!input.trim()}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          className="ai-chat-trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Ask SriVoraAI Assistant"
        >
          <Bot size={20} />
          <span className="trigger-text">Ask SriVoraAI</span>
          <span className="trigger-sparkle">✨</span>
        </button>
      )}
    </div>
  )
}
