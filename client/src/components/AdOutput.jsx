import { useState, useRef, useEffect } from 'react'
import { Download, Copy, Check, Play, Hash, Loader2, Video, Image as ImageIcon, Shuffle, Palette, Layout } from 'lucide-react'
import html2canvas from 'html2canvas'
import { generateImageWithGemini, generateVideoWithVeo3, checkPuterReady } from '../utils/puterUtils'
import { getRandomTheme, getAllThemes } from '../utils/themes'

export default function AdOutput({ adData, formData }) {
  const [copiedHeadline, setCopiedHeadline] = useState(false)
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [downloadingImage, setDownloadingImage] = useState(false)
  const [downloadingVideo, setDownloadingVideo] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [aiImageUrl, setAiImageUrl] = useState(null)
  const posterRef = useRef(null)

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(getRandomTheme())
  const [showThemeControls, setShowThemeControls] = useState(false)

  const handleRandomTheme = () => {
    setCurrentTheme(getRandomTheme())
  }

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadImage = async (imageData, filename) => {
    setDownloadingImage(true)
    try {
      let blob
      if (imageData instanceof Blob) {
        blob = imageData
      } else if (typeof imageData === 'string') {
        // Try fetching with CORS to get a blob for proper download
        const response = await fetch(imageData, {
          mode: 'cors',
          credentials: 'omit'
        })
        if (!response.ok) throw new Error('Network response was not ok')
        blob = await response.blob()
      } else {
        throw new Error('Unsupported image format')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Download error:', error)
      
      // If fetch failed (likely CORS), try opening in new tab as fallback
      if (typeof imageData === 'string') {
        try {
          window.open(imageData, '_blank')
          return
        } catch (e) {
          console.error('Fallback download error:', e)
        }
      }
      
      alert('Failed to download image automatically. Please right-click the image and select "Save image as..."')
    } finally {
      setDownloadingImage(false)
    }
  }

  const downloadVideo = async (videoUrl, filename) => {
    setDownloadingVideo(true)
    try {
      const response = await fetch(videoUrl, {
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch video')
      }
      
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
    } catch (error) {
      console.error('Video download error:', error)
      
      // Fallback
      try {
        const link = document.createElement('a')
        link.href = videoUrl
        link.download = filename
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (fallbackError) {
        console.error('Fallback video download error:', fallbackError)
        alert('Failed to download video. Please right-click the video and select "Save video as..."')
      }
    } finally {
      setDownloadingVideo(false)
    }
  }

  const downloadPoster = async () => {
    if (posterRef.current) {
      try {
        const canvas = await html2canvas(posterRef.current, {
          backgroundColor: null,
          scale: 2
        })
        const link = document.createElement('a')
        link.download = `${adData.posterData.businessName}-poster.png`
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error('Error downloading poster:', error)
      }
    }
  }

  const generateAIImage = async () => {
    setGeneratingImage(true)
    try {
      if (!checkPuterReady()) {
        alert('AI services are still loading. Please wait a moment and try again.')
        setGeneratingImage(false)
        return
      }

      const prompt = `${adData.headline} - ${adData.caption}`
      const businessName = formData?.businessName || adData.posterData.businessName
      
      // Use client-side AI generation
      // const imageUrl = await generateImageWithGemini(prompt, businessName)
      
      console.log('Generating additional image...')
      const enhancedPrompt = `Professional marketing poster for ${businessName}: ${prompt}. High quality, modern design, commercial photography style, vibrant colors, professional layout, eye-catching.`
      
      const response = await window.puter.ai.txt2img(enhancedPrompt, {
        width: 1024,
        height: 1024
      })

      let imageUrl = response;
      if (typeof response === 'object' && response !== null) {
          if (response.url) imageUrl = response.url;
          else if (response instanceof HTMLImageElement) imageUrl = response.src;
      }
      
      if (imageUrl) {
        setAiImageUrl(imageUrl)
      } else {
        alert('Image generation completed but no URL returned. Please try again.')
      }
    } catch (error) {
      console.error('Error generating AI image:', error)
      alert(`Failed to generate image: ${error.message || 'Please try again.'}`)
    } finally {
      setGeneratingImage(false)
    }
  }

  const generateAIVideo = async () => {
    setGeneratingVideo(true)
    try {
      if (!checkPuterReady()) {
        alert('Puter.js SDK is still loading. Please wait a moment and try again.')
        setGeneratingVideo(false)
        return
      }

      const prompt = `${adData.headline}. ${adData.caption}. ${adData.cta}.`
      const businessName = formData?.businessName || adData.posterData.businessName
      
      // Use client-side Puter.js with Veo 3.0 Fast Audio
      const videoData = await generateVideoWithVeo3(prompt, businessName, 5)
      
      if (videoData && videoData.videoUrl) {
        setVideoUrl(videoData.videoUrl)
        setAudioUrl(videoData.audioUrl)
      } else {
        alert('Video generation completed but no URL returned. This may take a moment.')
      }
    } catch (error) {
      console.error('Error generating AI video:', error)
      alert(`Failed to generate video: ${error.message || 'Please try again.'}`)
    } finally {
      setGeneratingVideo(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Ad Ideas Section */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Layout className="w-6 h-6" />
          Ad Ideas
        </h3>

        {/* Headline */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Headline</label>
            <button
              onClick={() => copyToClipboard(adData.headline, setCopiedHeadline)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {copiedHeadline ? (
                <>
                  <Check className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-gray-900 dark:text-white font-semibold text-lg bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {adData.headline}
          </p>
        </div>

        {/* Caption */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Caption</label>
            <button
              onClick={() => copyToClipboard(adData.caption, setCopiedCaption)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {adData.caption}
          </p>
        </div>

        {/* Call to Action */}
        <div className="mb-4">
          <label className="label">Call-to-Action</label>
          <div className="inline-block px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg">
            {adData.cta}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label className="label flex items-center gap-1">
            <Hash className="w-4 h-4" />
            Hashtags
          </label>
          <div className="flex flex-wrap gap-2">
            {adData.hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Poster Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Poster Preview
            </h3>
            <button 
                onClick={handleRandomTheme}
                className="ml-2 sm:ml-4 p-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-2"
                title="Shuffle Theme"
            >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Shuffle Theme</span>
            </button>
             <div className="text-xs text-gray-500 dark:text-gray-400 ml-2 hidden lg:block">
                ({currentTheme.name})
            </div>
          </div>
          <button onClick={downloadPoster} className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        </div>

        <div 
          ref={posterRef}
          className="aspect-square rounded-lg overflow-hidden shadow-lg transition-all duration-500 ease-in-out"
          style={{ 
            background: currentTheme.style === 'gradient'
                ? `linear-gradient(135deg, ${currentTheme.bg}, ${currentTheme.bgSecond})`
                : currentTheme.style.startsWith('Pattern')
                    ? currentTheme.style.includes('radial') 
                        ? `radial-gradient(circle at center, ${currentTheme.bg}, ${currentTheme.accent})` // Fixed radial direction
                        : `repeating-linear-gradient(45deg, ${currentTheme.bg}, ${currentTheme.bg} 10px, ${currentTheme.accent} 10px, ${currentTheme.accent} 20px)`
                    : currentTheme.bg,
            color: currentTheme.text,
            fontFamily: currentTheme.font === 'serif' ? 'serif' : currentTheme.font === 'mono' ? 'monospace' : 'sans-serif',
          }}
        >
          <div className={`h-full flex flex-col justify-between p-8 relative ${currentTheme.layout === 'left' ? 'text-left' : 'text-center'}`}>
            {/* Top Section */}
            <div>
              <div className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-2">
                {adData.posterData.businessType}
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                {adData.posterData.businessName}
              </h2>
            </div>

            {/* Middle Section */}
            <div className="py-8">
              {adData.posterData.posterText && adData.posterData.posterText.length > 0 ? (
                <div className="space-y-2">
                  {adData.posterData.posterText.map((line, index) => (
                    <div 
                      key={index}
                      className={`font-black uppercase leading-tight ${
                        index === 0 ? 'text-6xl' : 'text-4xl'
                      } ${index > 0 ? 'opacity-90' : ''}`}
                      style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-5xl font-black mb-4">
                  SPECIAL OFFER
                </div>
              )}
              <div className="text-2xl font-bold whitespace-pre-line mt-6 opacity-90">
                {adData.posterData.productName}
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              <div className="text-lg font-semibold mb-2">
                {adData.cta}
              </div>
              <div className="text-sm opacity-80 space-y-1">
                {formData?.phone && (
                  <div>📱 {formData.phone}</div>
                )}
                {formData?.address && (
                  <div>📍 {formData.address}</div>
                )}
                {formData?.email && (
                  <div>✉️ {formData.email}</div>
                )}
                {!formData?.phone && !formData?.address && !formData?.email && (
                  <div>📱 Contact Us Today | 📍 Visit Our Store</div>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20 blur-2xl"
                 style={{ backgroundColor: adData.posterData.textColor }}>
            </div>
            <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full opacity-20 blur-3xl"
                 style={{ backgroundColor: adData.posterData.textColor }}>
            </div>
          </div>
        </div>
      </div>

      {/* Generated AI Image from Form */}
      {adData.generatedImage && (
        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              ObsidianColors Result
            </h3>
          </div>
          <div className="space-y-3">
            <img 
              src={adData.generatedImage instanceof Blob ? URL.createObjectURL(adData.generatedImage) : adData.generatedImage} 
              alt="AI Generated from prompt" 
              className="w-full rounded-lg shadow-lg"
            />
            <button
              onClick={() => downloadImage(adData.generatedImage, 'ai-generated-ad-image.png')}
              disabled={downloadingImage}
              className="btn-primary w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {downloadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Generated Image
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Show notice if image prompt was provided but no image generated */}
      {!adData.generatedImage && formData?.imagePrompt && formData.imagePrompt.trim() !== '' && (
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-3">
            <ImageIcon className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
              ObsidianColors Unavailable
            </h3>
          </div>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-3">
            ObsidianColors service is temporarily unavailable. You can try using the "ObsidianColors" below as an alternative.
          </p>
          <p className="text-yellow-700 dark:text-yellow-300 text-xs">
            <strong>Your prompt:</strong> {formData.imagePrompt}
          </p>
        </div>
      )}

      {/* AI Image Generation */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary-600" />
            ObsidianColors
          </h3>
        </div>

        {aiImageUrl ? (
          <div className="space-y-3">
            <img 
              src={aiImageUrl} 
              alt="AI Generated" 
              className="w-full rounded-lg shadow-lg"
            />
            <button
              onClick={() => downloadImage(aiImageUrl, 'ai-generated-image.png')}
              disabled={downloadingImage}
              className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {downloadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download AI Image
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate an additional AI image based on your ad content
            </p>
            <button
              onClick={generateAIImage}
              disabled={generatingImage}
              className="btn-primary flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              {generatingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Generate Additional Image
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Powered by Advanced AI Generation
            </p>
          </div>
        )}
      </div>

      {/* Video Preview with AI */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🎥 Video Generator (Beta)
          </h3>
        </div>

        {videoUrl ? (
          <div className="space-y-3">
            <video 
              src={videoUrl} 
              controls 
              className="w-full rounded-lg shadow-lg aspect-video bg-black"
            >
              Your browser does not support video playback.
            </video>
            {audioUrl && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">🎵 Audio Track:</p>
                <audio src={audioUrl} controls className="w-full" />
              </div>
            )}
            <button
              onClick={() => downloadVideo(videoUrl, 'ai-generated-video.mp4')}
              disabled={downloadingVideo}
              className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {downloadingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Video
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <p className="text-white text-lg font-semibold mb-2">
                  Generate AI Video with Audio
                </p>
                <p className="text-gray-300 text-sm mb-6 px-4">
                  Create a professional video ad with voiceover using AI
                </p>
                <button
                  onClick={() => alert('This feature will come soon')}
                  disabled={generatingVideo}
                  className="btn-primary flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {generatingVideo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      Generate AI Video
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  Powered by Advanced AI Video Generation
                </p>
              </div>
            </div>
          </div>
        )}

        {generatingVideo && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ⏳ Video generation typically takes 1-2 minutes. Please wait...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
