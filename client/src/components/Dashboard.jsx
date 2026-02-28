import { useState, useEffect } from 'react'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import AdGeneratorForm from './AdGeneratorForm'
import AdOutput from './AdOutput'
// import TemplatesSidebar from './TemplatesSidebar'
// import AISuggestions from './AISuggestions'
// import AIChatAssistant from './AIChatAssistant'
// import { generateAdContentWithGemini, checkPuterReady } from '../utils/puterUtils'

export default function Dashboard({ onBackToHome }) {
  const [formData, setFormData] = useState({
    adName: '',
    adDescription: '',
    role: '',
    goal: '',
    instructions: '',
    imagePrompt: '',
    businessName: '',
    businessType: 'Restaurant',
    productName: '',
    occasion: 'Sale',
    tone: 'Professional',
    language: 'English'
  })
  const [productImage, setProductImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generatedAd, setGeneratedAd] = useState(null)
  const [error, setError] = useState(null)
  const [imageWarning, setImageWarning] = useState(null)

  const extractPosterText = (description, adName) => {
    if (!description || description.trim() === '') {
      return ['SPECIAL OFFER', 'LIMITED TIME']
    }

    const desc = description.toLowerCase()
    const lines = description.split(/[.,!\n]/).map(l => l.trim()).filter(l => l)
    
    // Try to extract short, punchy lines from the description
    const posterLines = []
    
    // Check for buy X get Y offers
    if (desc.includes('buy') && desc.includes('get')) {
      const buyGetMatch = desc.match(/buy\s+(\d+)\s+get\s+(\d+)/i)
      if (buyGetMatch) {
        posterLines.push(`BUY ${buyGetMatch[1]} GET ${buyGetMatch[2]}`)
        posterLines.push('FREE')
      } else {
        posterLines.push('BUY MORE')
        posterLines.push('SAVE MORE')
      }
    }
    // Check for percentage discounts
    else if (desc.match(/\d+%\s*(off|discount)/)) {
      const match = desc.match(/(\d+)%\s*(off|discount)/)
      posterLines.push(`${match[1]}% OFF`)
      posterLines.push('LIMITED TIME')
    }
    // Check for grand opening
    else if (desc.includes('grand opening')) {
      posterLines.push('GRAND OPENING')
      posterLines.push('SPECIAL DEALS')
    }
    // Extract key phrases from description
    else {
      // Take the first 1-2 short meaningful lines from description
      for (const line of lines) {
        if (line.length > 3 && line.length <= 30 && posterLines.length < 3) {
          // Clean up and format
          const cleanLine = line.replace(/[^\w\s]/g, '').trim().toUpperCase()
          if (cleanLine.length <= 25) {
            posterLines.push(cleanLine)
          }
        }
      }
    }
    
    // If we couldn't extract anything good, use the description itself
    if (posterLines.length === 0) {
      const words = description.trim().split(' ')
      let currentLine = ''
      for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= 25) {
          currentLine = (currentLine + ' ' + word).trim()
        } else {
          if (currentLine && posterLines.length < 3) {
            posterLines.push(currentLine.toUpperCase())
          }
          currentLine = word
        }
      }
      if (currentLine && posterLines.length < 3) {
        posterLines.push(currentLine.toUpperCase())
      }
    }
    
    return posterLines.length > 0 ? posterLines : ['SPECIAL OFFER', 'LIMITED TIME']
  }

  const generateCatchyTagline = (description, adName) => {
    if (!description || description.trim() === '') {
      return 'Experience Excellence Today'
    }

    const desc = description.toLowerCase()
    
    // Special Offer/Poster
    if (desc.includes('offer') || desc.includes('special') || desc.includes('promotion') || desc.includes('poster')) {
      return `${adName || 'Special'} - Limited Time Only!`
    }
    // Sale
    if (desc.includes('sale') || desc.includes('discount') || desc.includes('deal')) {
      return `Unbeatable ${adName || 'Deals'} - Save Big Today!`
    }
    // Food
    if (desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe') || desc.includes('dining')) {
      return `Taste the Difference\nFresh • Delicious • Authentic`
    }
    // Tech
    if (desc.includes('tech') || desc.includes('app') || desc.includes('software') || desc.includes('digital')) {
      return `Innovation Meets Excellence\nYour Future Starts Here`
    }
    // Fashion/Beauty
    if (desc.includes('fashion') || desc.includes('clothing') || desc.includes('style') || desc.includes('beauty') || desc.includes('cosmetic')) {
      return `Elevate Your Style\nTrend-Setting Fashion for You`
    }
    // Event
    if (desc.includes('event') || desc.includes('launch') || desc.includes('festival') || desc.includes('celebration')) {
      return `Don't Miss Out!\nAn Unforgettable Experience Awaits`
    }
    
    // Generic - extract key words and create tagline
    const words = description.split(' ').filter(w => w.length > 4)
    if (words.length > 0) {
      const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      return `${firstWord} Like Never Before\nQuality You Can Trust`
    }
    
    return `${adName || 'Excellence'} - Your Perfect Choice`
  }

  const handleGenerateAd = async () => {
    if (!formData.adName && !formData.role) {
      setError('Please fill in at least the Ad Name and Message')
      return
    }

    setLoading(true)
    setError(null)
    setImageWarning(null)
    
    try {
      // Generate catchy tagline from description
      const catchyTagline = generateCatchyTagline(formData.adDescription, formData.adName)
      
      // Extract poster text from description
      const posterTextLines = extractPosterText(formData.adDescription, formData.adName)
      
      // Simulate ad generation with ad form data
      const posterData = {
        businessName: formData.adName || 'Marketing Ad',
        productName: catchyTagline,
        occasion: formData.goal ? formData.goal.substring(0, 50) : 'Special Offer',
        headline: formData.role ? formData.role.substring(0, 80) : 'Your Ad Here',
        posterText: posterTextLines,
        backgroundColor: '#4a5568',
        textColor: '#ffffff',
        businessType: 'Marketing'
      }

      const result = {
        headline: posterData.headline,
        caption: formData.instructions || 'Professional marketing content created with AI',
        cta: 'Learn More',
        hashtags: ['#Marketing', '#Business', '#AI', '#Advertising', '#Success', '#Growth'],
        posterData,
        generatedAt: new Date().toISOString()
      }
      
      // Generate AI image if prompt is provided
      if (formData.imagePrompt && formData.imagePrompt.trim() !== '') {
        try {
          console.log('Generating AI image with prompt:', formData.imagePrompt)
          
            // Check if AI service is available
            if (typeof window.puter === 'undefined' || !window.puter.ai) {
            console.warn('AI service not available, skipping image generation')
            setImageWarning('AI image generation is currently unavailable. Ad created without image.')
          } else {
            const imageUrl = await window.puter.ai.txt2img(formData.imagePrompt, {
              width: 1024,
              height: 1024
            })
            
            // Check if result is an object with a url property (some Puter versions)
            // or a string (others)
            let finalImageUrl = imageUrl;
            if (typeof imageUrl === 'object' && imageUrl !== null) {
               if (imageUrl.url) finalImageUrl = imageUrl.url;
               // If it's a DOM element (Image), we need its src
               else if (imageUrl instanceof HTMLImageElement) finalImageUrl = imageUrl.src;
            }
            
            result.generatedImage = finalImageUrl
            console.log('AI Image generated successfully')
          }
        } catch (imgErr) {
          console.error('Failed to generate AI image:', imgErr)
          const errorMessage = imgErr.message || 'Unknown error'
          // Show warning but don't fail the entire ad generation
          if (errorMessage.includes('temporarily disabled')) {
            setImageWarning('ObsidianColors is temporarily unavailable. Your ad was created without the custom image.')
          } else {
            setImageWarning(`Could not generate image: ${errorMessage}`)
          }
        }
      }
      
      setGeneratedAd(result)
      setError(null)
    } catch (err) {
      setError(`Failed to generate ad: ${err.message || 'Please try again'}`)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
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
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">InstaAd AI</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div>
              <AdGeneratorForm
                formData={formData}
                setFormData={setFormData}
                productImage={productImage}
                setProductImage={setProductImage}
                onGenerate={handleGenerateAd}
                loading={loading}
              />
              
              {/* AI Suggestions - Temporarily Disabled */}
              {/* <AISuggestions formData={formData} /> */}
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}
              
              {imageWarning && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Note:</strong> {imageWarning}
                </div>
              )}
            </div>

            {/* Right Column - Output */}
            <div>
              {loading ? (
                <div className="card h-full flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">
                    Generating your ad with AI...
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Creating amazing content for you
                  </p>
                </div>
              ) : generatedAd ? (
                <AdOutput adData={generatedAd} formData={formData} />
              ) : (
                <div className="card h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">
                    Ready to Create Your Ad?
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    Fill in the form and click "Generate Ad" to create professional marketing content instantly using AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* AI Chat Assistant - Temporarily Disabled */}
      {/* <AIChatAssistant /> */}
    </div>
  )
}
