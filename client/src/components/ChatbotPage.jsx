import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react'

export default function ChatbotPage({ onBackToHome }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Obsidian, your AI assistant. Ask me anything! 🚀"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const messagesEndRef = useRef(null)
  const [isPuterReady, setIsPuterReady] = useState(false)

  useEffect(() => {
    // Check if AI Service is loaded
    const checkPuter = () => {
      if (typeof window.puter !== 'undefined' && window.puter.ai) {
        setIsPuterReady(true)
        console.log('✅ AI Service loaded and ready!')
      } else {
        console.log('⏳ Waiting for AI Service...')
        setTimeout(checkPuter, 100)
      }
    }
    checkPuter()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText])

  // Clean markdown formatting from text
  const cleanMarkdown = (text) => {
    return text
      .replace(/#{1,6}\s/g, '') // Remove markdown headers (###, ##, etc.)
      .replace(/\*\*/g, '') // Remove bold markers (**)
      .replace(/\*/g, '') // Remove italic markers (*)
      .replace(/`{1,3}/g, '') // Remove code markers (`, ```)
      .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
      .trim()
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !isPuterReady) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message to state
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    setStreamingText('')

    try {
      // Use AI service with streaming for real-time responses
      const response = await window.puter.ai.chat(userMessage, {
        model: 'google/gemini-2.5-pro',
        stream: true,
        temperature: 0.7
      })

      let fullText = ''
      
      // Stream the response
      for await (const part of response) {
        if (part?.text) {
          fullText += part.text
          setStreamingText(cleanMarkdown(fullText))
        }
      }

      // Add complete response to messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanMarkdown(fullText)
      }])
      setStreamingText('')
      
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error. Please try again." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-primary-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Obsidian AI</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your personal marketing assistant
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isPuterReady 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {isPuterReady ? '● Connected' : '● Loading...'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[calc(100vh-200px)]">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700' 
                    : 'bg-gradient-to-br from-purple-600 to-purple-700'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 p-4 rounded-2xl max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {streamingText && (
              <div className="flex gap-4 flex-row">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-700">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none max-w-[80%]">
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {streamingText}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 animate-pulse" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Streaming...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && !streamingText && (
              <div className="flex gap-4 flex-row">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-700">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isPuterReady ? "Type your message here..." : "Loading services..."}
                disabled={!isPuterReady || loading}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows="2"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || !isPuterReady}
                className="px-6 py-3 bg-gradient-to-br from-purple-600 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-primary-50 dark:from-purple-900/20 dark:to-primary-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            About Obsidian
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span><strong>Advanced AI Assistant</strong> for marketing help</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span>Real-time streaming responses for instant feedback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span>Perfect for content creation and general assistance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
