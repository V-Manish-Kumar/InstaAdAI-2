import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Download, Loader2, Sparkles, Wand2 } from 'lucide-react'

export default function VideoGeneratorPage({ onBackToHome }) {
  const [prompt, setPrompt] = useState('')
  const [generatedVideos, setGeneratedVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPuterReady, setIsPuterReady] = useState(false)
  
  useEffect(() => {
    // Check if AI service is loaded
    const checkPuter = () => {
      if (typeof window.puter !== 'undefined' && window.puter.ai) {
        setIsPuterReady(true)
        console.log('AI Service loaded and ready for video generation!')
      } else {
        console.log('Waiting for AI Service...')
        setTimeout(checkPuter, 100)
      }
    }
    checkPuter()
  }, [])

  const generateVideo = async () => {
    alert('This feature will come soon')
    return

    if (!prompt.trim() || loading || !isPuterReady) return

    const userPrompt = prompt.trim()
    setLoading(true)

    try {
      console.log('Generating video with prompt:', userPrompt)
      
      // Use Puter.js txt2vid with Google Veo 3 Audio model
      const videoResult = await window.puter.ai.txt2vid(userPrompt, {
        model: 'google/veo-3.0-audio'
      })

      console.log('Video generated successfully!', videoResult)
      
      let videoSrc = null;
      
      // Handle different return types from Puter.js
      if (videoResult instanceof HTMLVideoElement) {
        videoSrc = videoResult.src;
      } else if (typeof videoResult === 'string') {
        videoSrc = videoResult;
      } else if (videoResult && videoResult.src) {
        videoSrc = videoResult.src;
      } else if (videoResult && videoResult.url) {
        videoSrc = videoResult.url;
      }

      if (videoSrc) {
        // Add the generated video to the list
        setGeneratedVideos(prev => [{
          id: Date.now(),
          prompt: userPrompt,
          videoUrl: videoSrc,
          timestamp: new Date().toLocaleString()
        }, ...prev])
      } else {
        throw new Error('Could not retrieve video URL from response')
      }
      
      setPrompt('')
      
    } catch (error) {
      console.error('Video generation error:', error)
      alert(`Failed to generate video: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const downloadVideo = async (videoUrl, prompt) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      window.open(videoUrl, '_blank');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateVideo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                  <Video className="w-7 h-7 text-indigo-600" />
                  ObsidianMotion
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by Advanced Cinematic AI
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
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Describe Your Video
            </h2>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g., A cinematic drone shot of a futuristic city at sunset, with flying cars and neon lights, 4k resolution..."
              className="input-field min-h-[120px] resize-none"
              disabled={loading || !isPuterReady}
            />
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tip: Mention lighting, camera angles, and movement for best results
              </p>
              <button
                onClick={generateVideo}
                disabled={loading || !isPuterReady || !prompt.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Video...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Video</span>
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
                  "Slow motion water droplet falling into a calm blue lake",
                  "Time lapse of clouds moving over a mountain range",
                  "Cyberpunk street scene with rain and neon signs",
                  "Cute puppy running through field of flowers"
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(example)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generated Videos Grid */}
        <div>
          {generatedVideos.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Video className="w-6 h-6 text-indigo-600" />
                Generated Videos ({generatedVideos.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {generatedVideos.map((item) => (
                  <div 
                    key={item.id} 
                    className="card bg-white dark:bg-gray-800 overflow-hidden group hover:shadow-xl transition-shadow border-0"
                  >
                    <div className="aspect-video bg-black relative overflow-hidden rounded-lg">
                      <video
                        src={item.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        loop
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2 font-medium">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.timestamp}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadVideo(item.videoUrl, item.prompt)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
                        title="Download Video"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg text-center py-16 border-dashed border-2 border-gray-300 dark:border-gray-700">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No videos generated yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Enter a descriptive prompt above and click "Generate Video" to create your first cinema-quality AI video with audio.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
