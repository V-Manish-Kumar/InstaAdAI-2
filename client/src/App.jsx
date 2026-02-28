import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import ChatbotPage from './components/ChatbotPage'
import ImageGeneratorPage from './components/ImageGeneratorPage'
import VideoGeneratorPage from './components/VideoGeneratorPage'
import { Moon, Sun } from 'lucide-react'
// import { initializePuter, getPuterCapabilities, testPuterConnection } from './utils/puterUtils'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    // Puter.js SDK initialization disabled (AI features temporarily disabled)
    /* DISABLED
    let retryCount = 0
    const maxRetries = 10
    
    const initPuter = async () => {
      const isReady = initializePuter()
      if (isReady) {
        const capabilities = getPuterCapabilities()
        console.log('🚀 Puter.js ready!', capabilities)
        
        // Run connection test
        const testResult = await testPuterConnection()
        if (testResult.success) {
          console.log('✅ Puter.js connection test passed!');
        } else {
          console.error('⚠️ Puter.js connection test failed:', testResult.error);
        }
        
        // Test if we need authentication
        try {
          if (window.puter && window.puter.auth) {
            const authState = await window.puter.auth.getUser().catch(() => null)
            if (authState) {
              console.log('✅ Puter authenticated:', authState.username)
            } else {
              console.log('ℹ️ Puter running in anonymous mode')
            }
          }
        } catch (err) {
          console.log('ℹ️ Puter SDK loaded, authentication not required')
        }
      } else if (retryCount < maxRetries) {
        retryCount++
        console.log(`⏳ Waiting for Puter.js... Attempt ${retryCount}/${maxRetries}`)
        setTimeout(initPuter, 500)
      } else {
        console.error('❌ Failed to load Puter.js SDK after', maxRetries, 'attempts')
      }
    }
    
    // Start initialization after a small delay to ensure script is loaded
    const timer = setTimeout(initPuter, 100)
    return () => clearTimeout(timer)
    */
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Dark Mode Toggle - Fixed Position */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Page Routing */}
      {currentPage === 'landing' ? (
        <LandingPage 
          onNavigate={() => setCurrentPage('dashboard')}
          onNavigateToChatbot={() => setCurrentPage('chatbot')}
          onNavigateToImageGen={() => setCurrentPage('imagegen')}
          onNavigateToVideoGen={() => setCurrentPage('videogen')}
        />
      ) : currentPage === 'chatbot' ? (
        <ChatbotPage onBackToHome={() => setCurrentPage('landing')} />
      ) : currentPage === 'imagegen' ? (
        <ImageGeneratorPage onBackToHome={() => setCurrentPage('landing')} />
      ) : currentPage === 'videogen' ? (
        <VideoGeneratorPage onBackToHome={() => setCurrentPage('landing')} />
      ) : (
        <Dashboard onBackToHome={() => setCurrentPage('landing')} />
      )}
    </div>
  )
}

export default App
