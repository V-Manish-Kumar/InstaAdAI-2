import { Sparkles, Wand2, Maximize2, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function AdGeneratorForm({ 
  formData, 
  setFormData, 
  productImage, 
  setProductImage, 
  onGenerate, 
  loading 
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const improveImagePrompt = () => {
    if (!formData.imagePrompt || formData.imagePrompt.trim() === '') {
      alert('Please enter a basic image idea first.')
      return
    }

    const basicIdea = formData.imagePrompt.toLowerCase()
    const description = (formData.adDescription || '').toLowerCase()
    
    // Enhance the prompt based on the ad type
    let enhancedPrompt = ''
    
    // Detect type from description
    const hasOffer = description.includes('offer') || description.includes('special') || description.includes('promotion')
    const hasSale = description.includes('sale') || description.includes('discount')
    const hasFood = description.includes('food') || description.includes('restaurant') || description.includes('cafe')
    const hasTech = description.includes('tech') || description.includes('app') || description.includes('software')
    const hasFashion = description.includes('fashion') || description.includes('clothing') || description.includes('beauty')
    const hasEvent = description.includes('event') || description.includes('launch') || description.includes('festival')
    
    if (hasFood) {
      enhancedPrompt = `Professional food photography: ${basicIdea}, extreme close-up with golden hour natural lighting, steam rising, vibrant colors, appetizing presentation, rustic wooden background, shallow depth of field, 4K quality, magazine-style food photography`
    } else if (hasTech) {
      enhancedPrompt = `Modern tech product photography: ${basicIdea}, floating at dynamic angle, dark gradient background with blue and purple tones, neon rim lighting, holographic UI elements, sleek minimalist design, futuristic aesthetic, 8K resolution, professional commercial photography`
    } else if (hasFashion) {
      enhancedPrompt = `High-fashion editorial photography: ${basicIdea}, professional model, perfect lighting, elegant composition, sophisticated styling, trendy aesthetic, magazine quality, natural pose, beautiful background, 8K resolution, fashion magazine style`
    } else if (hasEvent) {
      enhancedPrompt = `Dynamic event photography: ${basicIdea}, energetic crowd, dramatic stage lighting, vibrant colors, confetti and celebration, professional event photography, exciting atmosphere, wide angle shot, 4K quality`
    } else if (hasSale || hasOffer) {
      enhancedPrompt = `Eye-catching promotional imagery: ${basicIdea}, vibrant colors with red and yellow accents, bold composition, clear product focus, energetic and exciting mood, professional commercial photography, attention-grabbing design, 4K quality`
    } else {
      enhancedPrompt = `Professional commercial photography: ${basicIdea}, high quality, perfect composition, professional lighting, clean background, vibrant colors, modern aesthetic, eye-catching, 8K resolution, commercial grade`
    }
    
    setFormData(prev => ({
      ...prev,
      imagePrompt: enhancedPrompt
    }))
  }

  const generateWithAI = (field) => {
    // Check if description is provided
    if (!formData.adDescription || formData.adDescription.trim() === '') {
      alert('Please fill in the Description field first to generate AI suggestions.')
      return
    }

    const description = formData.adDescription.toLowerCase()
    const name = formData.adName || 'your campaign'
    
    // Analyze description for key elements
    const hasProduct = description.includes('product') || description.includes('item') || description.includes('shoe') || description.includes('watch') || description.includes('phone')
    const hasSale = description.includes('sale') || description.includes('discount') || description.includes('deal')
    const hasOffer = description.includes('offer') || description.includes('special') || description.includes('promotion') || description.includes('poster')
    const hasEvent = description.includes('event') || description.includes('launch') || description.includes('festival') || description.includes('celebration')
    const hasFood = description.includes('food') || description.includes('restaurant') || description.includes('cafe') || description.includes('dining')
    const hasTech = description.includes('tech') || description.includes('app') || description.includes('software') || description.includes('digital')
    const hasFashion = description.includes('fashion') || description.includes('clothing') || description.includes('style') || description.includes('wear')
    const hasBeauty = description.includes('beauty') || description.includes('cosmetic') || description.includes('skincare') || description.includes('makeup')
    
    // Generate creative and visual suggestions
    let roleMsg, goalMsg, instructionsMsg
    
    if (hasOffer) {
      roleMsg = `Create eye-catching promotional poster content for ${formData.adDescription}. Use bold, clear typography with strong contrast. Design should feature large headline text, vibrant colors, and clean layout that works for both print and digital.`
      goalMsg = `Maximize visibility and response for ${formData.adDescription}. Create memorable visual impact. Visual focus: bold headlines, benefit-driven messaging, clear pricing/offer details, minimal clutter.`
      instructionsMsg = `Use large, bold headline fonts (Impact, Bebas Neue) with high contrast colors. Feature the main offer/benefit prominently in top third. Keep text minimal and scannable - max 3 key points. Use vibrant accent colors for important details. Include clear expiration dates or urgency elements. Add simple icons or graphics to break up text. Ensure readable from 10 feet away. Include strong CTA button or text.`
    } else if (hasSale) {
      roleMsg = `Create irresistible promotional content for ${formData.adDescription}. Craft urgency-driven copy with bold headlines. Use vibrant colors (red, yellow, orange) to grab attention. Design should feature eye-catching sale badges, countdown timers, and excited customers.`
      goalMsg = `Drive immediate purchase action for ${ formData.adDescription}. Create FOMO through limited-time messaging. Visual focus: before/after prices, happy shoppers, shopping bags, celebration confetti.`
      instructionsMsg = `Use powerful discount headlines like "UP TO 70% OFF" or "LIMITED TIME SALE". Show striking price comparisons with clear before/after pricing. Feature vibrant reds, yellows, and golds with bold fonts. Add sale badges, star bursts, and urgency elements. Include strong CTAs like "SHOP NOW" or "GRAB THE DEAL".`
    } else if (hasFood) {
      roleMsg = `Create mouthwatering content for ${formData.adDescription}. Use sensory language that makes viewers hungry. Emphasize freshness and quality. Visual styling should be warm and inviting with close-up shots of delicious dishes.`
      goalMsg = `Make viewers crave ${formData.adDescription} and drive orders. Visual focus: steam rising from hot food, cheese pulls, sauce drizzles, fresh ingredients, happy diners.`
      instructionsMsg = `Show extreme close-ups of food with perfect golden hour lighting. Capture steam, melting cheese, and crispy textures. Use warm colors and cozy mood. Include fresh herbs and rustic props. Add appetizing CTAs like "ORDER NOW" or "TASTE THE DIFFERENCE".`
    } else if (hasTech) {
      roleMsg = `Create sleek, futuristic content for ${formData.adDescription}. Use modern language highlighting innovation and features. Design should be minimalist with gradients, glowing elements, and digital aesthetics.`
      goalMsg = `Position ${formData.adDescription} as must-have tech. Visual focus: device close-ups with UI animations, blue/purple glows, hands interacting with technology smoothly.`
      instructionsMsg = `Feature product at dynamic angles with rim lighting and glow effects. Use blues, purples, and cyans on dark backgrounds. Show UI overlays and holographic elements. Add tech effects like light trails and particles. Include CTAs like "GET STARTED" or "UPGRADE NOW".`
    } else if (hasFashion || hasBeauty) {
      roleMsg = `Create stunning, aspirational content for ${formData.adDescription}. Use elegant language about style and confidence. Visual styling should be magazine-quality with perfect lighting and professional models.`
      goalMsg = `Inspire desire for ${formData.adDescription}. Visual focus: styled models in perfect lighting, fabric textures, color palettes, before/after transformations.`
      instructionsMsg = `Show professional photography with perfect makeup and styling. Use soft flattering lighting and rule of thirds composition. Feature sophisticated colors and elegant fonts. Add lifestyle context and trendy accessories. Include CTAs like "SHOP THE LOOK" or "FIND YOUR STYLE".`
    } else if (hasEvent) {
      roleMsg = `Create exciting, buzz-worthy content for ${formData.adDescription}. Build anticipation and FOMO. Visual styling should capture energy, crowds, and celebration vibes with dynamic compositions.`
      goalMsg = `Generate maximum attendance for ${formData.adDescription}. Visual focus: crowds with raised hands, stage lights, performers, confetti, event details prominently displayed.`
      instructionsMsg = `Use energetic headlines like "DON'T MISS" or "EPIC NIGHT". Show dynamic crowd shots with dramatic stage lighting and performers mid-action. Display event date/time prominently. Add motion blur and light effects. Include CTAs like "GET TICKETS" or "RSVP NOW".`
    } else {
      // Generic creative suggestions
      roleMsg = `Create compelling content for ${formData.adDescription}. Use powerful storytelling that connects emotionally. Highlight unique value and key benefits with professional, eye-catching visuals.`
      goalMsg = `Drive engagement and conversions for ${formData.adDescription}. Visual focus: hero product prominently displayed, happy customers, clear value demonstration, lifestyle context.`
      instructionsMsg = `Use benefit-driven headlines that address customer needs. Feature high-quality photography with good composition. Choose colors that evoke the right emotions (blue=trust, red=urgency, green=growth). Add social proof like testimonials and ratings. Include clear CTAs like "START NOW" or "LEARN MORE".`
    }
    
    const suggestions = {
      role: roleMsg,
      goal: goalMsg,
      instructions: instructionsMsg
    }
    
    if (suggestions[field]) {
      setFormData(prev => ({
        ...prev,
        [field]: suggestions[field]
      }))
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ad Builder
        </h2>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
        {/* Name */}
        <div>
          <label className="label text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="adName"
            value={formData.adName || ''}
            onChange={handleInputChange}
            placeholder="Ad campaign name"
            className="input-field"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label text-sm font-medium">
            Description
          </label>
          <input
            type="text"
            name="adDescription"
            value={formData.adDescription || ''}
            onChange={handleInputChange}
            placeholder="Brief description of your ad campaign"
            className="input-field"
          />
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Contact Information (Optional)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Fill in any contact details you want to display on your poster
          </p>
          
          {/* Phone */}
          <div>
            <label className="label text-sm font-medium">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className="input-field"
            />
          </div>

          {/* Address */}
          <div>
            <label className="label text-sm font-medium">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="123 Main St, City, State 12345"
              className="input-field"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="contact@example.com"
              className="input-field"
            />
          </div>
        </div>

        {/* Ad Message */}
        <div>
          <label className="label text-sm font-medium flex items-center justify-between">
            <span>Ad Message</span>
            <button
              type="button"
              onClick={() => generateWithAI('role')}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
            >
              <Wand2 className="w-3 h-3" />
              Generate with AI
            </button>
          </label>
          <div className="relative">
            <textarea
              name="role"
              value={formData.role || ''}
              onChange={handleInputChange}
              placeholder="Create compelling ad copy that resonates with your audience..."
              className="input-field min-h-[80px] resize-none pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ad Goal */}
        <div>
          <label className="label text-sm font-medium flex items-center justify-between">
            <span>Ad Goal</span>
            <button
              type="button"
              onClick={() => generateWithAI('goal')}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
            >
              <Wand2 className="w-3 h-3" />
              Generate with AI
            </button>
          </label>
          <div className="relative">
            <textarea
              name="goal"
              value={formData.goal || ''}
              onChange={handleInputChange}
              placeholder="Drive sales, increase brand awareness, boost engagement..."
              className="input-field min-h-[80px] resize-none pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ad Instructions */}
        <div>
          <label className="label text-sm font-medium flex items-center justify-between">
            <span>Ad Instructions</span>
            <button
              type="button"
              onClick={() => generateWithAI('instructions')}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
            >
              <Wand2 className="w-3 h-3" />
              Generate with AI
            </button>
          </label>
          <div className="relative">
            <textarea
              name="instructions"
              value={formData.instructions || ''}
              onChange={handleInputChange}
              placeholder="HIGHLIGHT the key benefits. INCLUDE a strong call-to-action. USE emotional triggers. KEEP messaging clear and concise."
              className="input-field min-h-[120px] resize-none pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <strong>Tip:</strong> Use UPPERCASE for actions and be specific about the desired behavior.
          </div>
        </div>

        {/* Image Prompt Section */}
        <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              AI Image Generation Prompt
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Describe the image you want to generate for your ad
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> ObsidianColors uses advanced generative models. If the service is temporarily unavailable, your ad will be created without the custom image. You can use the "ObsidianColors" in the output section as an alternative.
          </div>
          
          <div>
            <label className="label text-sm font-medium flex items-center justify-between">
              <span>Image Description</span>
              <button
                type="button"
                onClick={improveImagePrompt}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                Improve with AI
              </button>
            </label>
            <div className="relative">
              <textarea
                name="imagePrompt"
                value={formData.imagePrompt || ''}
                onChange={handleInputChange}
                placeholder="E.g., A delicious burger with melting cheese on a wooden table..."
                className="input-field min-h-[100px] resize-none pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
              <strong>Tip:</strong> Enter a simple idea, then click "Improve with AI" to enhance it with professional details.
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Ad...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Create Ad</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
