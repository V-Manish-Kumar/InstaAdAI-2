import { useState, useEffect } from 'react'
import { Sparkles, Lightbulb, Loader2, RefreshCw } from 'lucide-react'
import { getAISuggestions, checkPuterReady } from '../utils/puterUtils'

export default function AISuggestions({ formData }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSuggestions = async () => {
    if (!formData.businessType || !formData.productName) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!checkPuterReady()) {
        setError('AI service is loading...')
        setLoading(false)
        return
      }

      // Use client-side Puter.js with Gemini 3 Pro
      const aiSuggestions = await getAISuggestions(formData)
      
      if (aiSuggestions && aiSuggestions.length > 0) {
        setSuggestions(aiSuggestions)
        setError(null)
      } else {
        setError('No suggestions available')
        setSuggestions([
          'Try adding urgency with limited-time offers',
          'Include customer testimonials for trust',
          'Use vibrant colors to catch attention'
        ])
      }
    } catch (err) {
      setError('AI temporarily unavailable')
      console.error('AI Suggestions Error:', err)
      // Fallback suggestions
      setSuggestions([
        'Try adding urgency with limited-time offers',
        'Include customer testimonials for trust',
        'Use vibrant colors to catch attention'
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (formData.businessType && formData.productName) {
      fetchSuggestions()
    }
  }, [formData.businessType, formData.productName, formData.occasion])

  if (!formData.businessType || !formData.productName) {
    return null
  }

  return (
    <div className="card mt-4 bg-gradient-to-br from-purple-50 to-primary-50 dark:from-purple-900/20 dark:to-primary-900/20 border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Suggestions
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Powered by Gemini 3 Pro</p>
          </div>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800/30 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh suggestions"
        >
          <RefreshCw className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && suggestions.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Getting AI suggestions...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
          ⚠️ {error} (showing fallback suggestions)
        </div>
      )}
    </div>
  )
}
