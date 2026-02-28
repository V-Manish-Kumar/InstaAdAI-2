import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Wand2, Download, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react'

export default function ImageGeneratorPage({ onBackToHome }) {
  const [prompt, setPrompt] = useState('')
  const [generatedImages, setGeneratedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPuterReady, setIsPuterReady] = useState(false)
  const imageContainerRef = useRef(null)

  useEffect(() => {
    // Check if AI service is loaded
    const checkPuter = () => {
      if (typeof window.puter !== 'undefined') {
        setIsPuterReady(true)
        console.log('✅ AI Service loaded and ready for image generation!')
      } else {
        console.log('⏳ Waiting for AI Service...')
        setTimeout(checkPuter, 100)
      }
    }
    checkPuter()
  }, [])

  const generateImage = async () => {
    if (!prompt.trim() || loading || !isPuterReady) return

    const userPrompt = prompt.trim()
    setLoading(true)

    try {
      console.log('🎨 Generating image with prompt:', userPrompt)
      
      // Use advanced AI models for image generation
      let imageData = await window.puter.ai.txt2img(userPrompt, {
        width: 1024,
        height: 1024,
      })

      // Check if result is an object with a url property or a string
      if (typeof imageData === 'object' && imageData !== null) {
          if (imageData.url) imageData = imageData.url;
          else if (imageData instanceof HTMLImageElement) imageData = imageData.src;
      }

      console.log('✅ Image generated successfully!')
      
      // Add the generated image to the list
      setGeneratedImages(prev => [{
        id: Date.now(),
        prompt: userPrompt,
        imageData: imageData,
        timestamp: new Date().toLocaleString()
      }, ...prev])
      
      setPrompt('')
      
    } catch (error) {
      console.error('Image generation error:', error)
      alert(`Failed to generate image: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async (imageData, prompt) => {
    try {
      // Convert imageData to blob if needed
      let blob
      if (imageData instanceof Blob) {
        blob = imageData
      } else if (typeof imageData === 'string') {
        // If it's a base64 string or URL
        const response = await fetch(imageData, { mode: 'cors', credentials: 'omit' })
        if (!response.ok) throw new Error('Network response was not ok')
        blob = await response.blob()
      } else {
        throw new Error('Unsupported image format')
      }

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Download error:', error)
      
      // Fallback: Open in new tab
      if (typeof imageData === 'string') {
        try {
           window.open(imageData, '_blank')
           return
        } catch (e) {
          console.error('Fallback failed:', e)
        }
      }
      
      alert('Failed to download image automatically.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-7 h-7 text-purple-600" />
                  ObsidianColors
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by Advanced Generative AI
                </p>
              </div>
            </div>
            {!isPuterReady && (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading Models...</span> 
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Input Section */}
        <div className="card mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Describe Your Image
            </h2>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g., A futuristic city at sunset with flying cars, vibrant neon lights, and tall skyscrapers..."
              className="input-field min-h-[120px] resize-none"
              disabled={loading || !isPuterReady}
            />
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 Tip: Be specific and descriptive for best results
              </p>
              <button
                onClick={generateImage}
                disabled={loading || !isPuterReady || !prompt.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>
            </div>

            {/* Example Prompts */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "A cozy coffee shop with warm lighting and plants",
                  "Modern tech startup office with glass walls",
                  "Delicious burger with melting cheese on a wooden table",
                  "Fashion model in elegant dress on city street"
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(example)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generated Images Grid */}
        <div ref={imageContainerRef}>
          {generatedImages.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-purple-600" />
                Generated Images ({generatedImages.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((item) => (
                  <div 
                    key={item.id} 
                    className="card bg-white dark:bg-gray-800 overflow-hidden group hover:shadow-2xl transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                      {item.imageData && (
                        <img
                          src={
                            item.imageData instanceof Blob 
                              ? URL.createObjectURL(item.imageData)
                              : item.imageData
                          }
                          alt={item.prompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Image load error:', e)
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Loading Error%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      )}
                      <button
                        onClick={() => downloadImage(item.imageData, item.prompt)}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Download image"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                        {item.prompt}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg text-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No images generated yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a prompt above and click "Generate Image" to create your first AI image
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
