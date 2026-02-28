import axios from 'axios';

// Puter.js AI Service Integration
class PuterAIService {
  constructor() {
    this.apiBase = 'https://api.puter.com/drivers/call';
  }

  // Generate AI content using Gemini 3 Pro
  async generateAdContentWithGemini(formData) {
    const { businessName, businessType, productName, occasion, tone, adDescription } = formData;

    const prompt = `You are an expert marketing copywriter. Create compelling ad content for a small business.

Business Details:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Product/Service: ${productName}
- Occasion: ${occasion}
- Tone: ${tone}
${adDescription ? `- Description: ${adDescription}` : ''}

Please generate:
1. A catchy headline (max 80 characters)
2. An engaging caption (2-3 sentences)
3. A strong call-to-action (3-5 words)
4. 6 relevant hashtags
5. POSTER TEXT: Extract the most important offer/detail from the description and create 1-3 VERY SHORT, BOLD lines of text perfect for a poster (like "BUY 2 GET 1 FREE", "50% OFF", "GRAND OPENING"). Each line must be under 25 characters. Make it concise, impactful, and attention-grabbing like real posters. If no specific offer is mentioned, create compelling promotional text based on the occasion.

Format your response as JSON:
{
  "headline": "...",
  "caption": "...",
  "cta": "...",
  "hashtags": ["...", "...", ...],
  "posterText": ["LINE 1", "LINE 2", "LINE 3"]
}`;

    try {
      const response = await axios.post(this.apiBase, {
        interface: 'puter-chat-completion',
        driver: 'google:gemini-3.0-pro',
        method: 'complete',
        args: {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PUTER_API_KEY || ''}`
        }
      });

      // Parse the AI response
      const aiResponse = response.data.message?.content || response.data.result;
      
      // Try to extract JSON from the response
      let parsedContent;
      try {
        // Try to find JSON in the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (e) {
        // Fallback: parse manually
        parsedContent = this.parseAIResponse(aiResponse, formData);
      }

      return parsedContent;
    } catch (error) {
      console.error('Gemini AI Error:', error.response?.data || error.message);
      // Fallback to mock data if API fails
      return this.generateFallbackContent(formData);
    }
  }

  // Generate AI suggestions using Gemini 3 Pro
  async getAISuggestions(formData) {
    const { businessType, productName, occasion } = formData;

    const prompt = `As a marketing expert, provide 3 quick improvement suggestions for this ad campaign:
- Business Type: ${businessType}
- Product: ${productName}
- Occasion: ${occasion}

Provide 3 actionable tips (each max 60 characters).`;

    try {
      const response = await axios.post(this.apiBase, {
        interface: 'puter-chat-completion',
        driver: 'google:gemini-3.0-pro',
        method: 'complete',
        args: {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PUTER_API_KEY || ''}`
        }
      });

      const aiResponse = response.data.message?.content || response.data.result;
      
      // Extract suggestions
      const lines = aiResponse.split('\n').filter(line => line.trim());
      const suggestions = lines
        .slice(0, 3)
        .map(line => line.replace(/^[\d\.\-\*\s]+/, '').trim());

      return suggestions;
    } catch (error) {
      console.error('AI Suggestions Error:', error.response?.data || error.message);
      return [
        'Try adding urgency with limited-time offers',
        'Include customer testimonials for trust',
        'Use vibrant colors to catch attention'
      ];
    }
  }

  // Generate image using Veo 3
  async generateImageWithVeo3(prompt, businessName) {
    try {
      const imagePrompt = `Professional marketing poster for ${businessName}: ${prompt}. High quality, modern design, commercial photography style.`;

      const response = await axios.post(this.apiBase, {
        interface: 'puter-image-generation',
        driver: 'google:veo-3.0-fast-audio',
        method: 'generate',
        args: {
          prompt: imagePrompt,
          num_outputs: 1
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PUTER_API_KEY || ''}`
        },
        timeout: 60000 // 60 second timeout for image generation
      });

      return response.data.outputs?.[0] || response.data.result;
    } catch (error) {
      console.error('Veo3 Image Error:', error.response?.data || error.message);
      return null;
    }
  }

  // Generate video using Veo 3 Fast Audio
  async generateVideoWithVeo3(prompt, businessName, duration = 5) {
    try {
      const videoPrompt = `Create a ${duration}-second promotional video for ${businessName}: ${prompt}. Professional, engaging, with smooth transitions.`;

      const response = await axios.post(this.apiBase, {
        interface: 'puter-video-generation',
        driver: 'google:veo-3.0-fast-audio',
        method: 'generate',
        args: {
          prompt: videoPrompt,
          duration: duration,
          include_audio: true
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PUTER_API_KEY || ''}`
        },
        timeout: 120000 // 2 minute timeout for video generation
      });

      return {
        videoUrl: response.data.video_url || response.data.result,
        audioUrl: response.data.audio_url,
        status: 'completed'
      };
    } catch (error) {
      console.error('Veo3 Video Error:', error.response?.data || error.message);
      return {
        status: 'failed',
        error: error.message
      };
    }
  }

  // Helper: Parse AI response manually
  parseAIResponse(text, formData) {
    const lines = text.split('\n').filter(l => l.trim());
    
    return {
      headline: lines.find(l => l.toLowerCase().includes('headline'))?.split(':')[1]?.trim() 
        || `Amazing ${formData.occasion} at ${formData.businessName}!`,
      caption: lines.find(l => l.toLowerCase().includes('caption'))?.split(':')[1]?.trim()
        || `Get exclusive deals on ${formData.productName}. Limited time offer!`,
      cta: lines.find(l => l.toLowerCase().includes('cta') || l.toLowerCase().includes('call'))?.split(':')[1]?.trim()
        || 'Shop Now',
      hashtags: lines.filter(l => l.includes('#'))
        .flatMap(l => l.match(/#\w+/g))
        .slice(0, 6)
        || [`#${formData.businessName.replace(/\s/g, '')}`, `#${formData.occasion}`]
    };
  }

  // Fallback content when AI fails
  generateFallbackContent(formData) {
    const { businessName, businessType, productName, occasion, tone, adDescription } = formData;
    
    const headlines = {
      Sale: `Massive Sale at ${businessName}!`,
      Festival: `Celebrate with ${businessName}!`,
      'New Launch': `Introducing ${productName} at ${businessName}`,
      Offer: `Exclusive Offer: ${productName} at ${businessName}`
    };

    const captionTemplates = {
      Professional: `We are excited to bring you ${productName}. Visit ${businessName} and discover quality that speaks for itself.`,
      Fun: `Hey there! Ready for something awesome? ${productName} is waiting for you at ${businessName}! Let's make it happen!`,
      Luxury: `Experience the finest ${productName} at ${businessName}. Where elegance meets excellence.`,
      Local: `Your neighborhood ${businessType}, ${businessName}, brings you ${productName}. Come visit us today!`
    };

    const ctaOptions = {
      Sale: 'Shop Now',
      Festival: 'Celebrate with Us',
      'New Launch': 'Be the First',
      Offer: 'Claim Offer'
    };

    // Generate poster text from description or use defaults
    let posterText = [];
    if (adDescription) {
      const desc = adDescription.toLowerCase();
      // Try to extract offers
      if (desc.includes('buy') && desc.includes('get')) {
        posterText = ['BUY 2 GET 1', 'FREE'];
      } else if (desc.match(/\d+%\s*(off|discount)/)) {
        const match = desc.match(/(\d+)%\s*(off|discount)/);
        posterText = [`${match[1]}% OFF`, 'LIMITED TIME'];
      } else if (desc.includes('grand opening')) {
        posterText = ['GRAND OPENING', 'SPECIAL DEALS'];
      } else if (desc.includes('new')) {
        posterText = ['NEW ARRIVAL', productName.toUpperCase().substring(0, 20)];
      } else {
        posterText = [occasion.toUpperCase(), 'SPECIAL OFFER'];
      }
    } else {
      posterText = occasion === 'Sale' ? ['UP TO 50% OFF', 'LIMITED TIME'] : [occasion.toUpperCase(), 'SPECIAL OFFER'];
    }

    return {
      headline: headlines[occasion] || `Check out ${productName} at ${businessName}!`,
      caption: captionTemplates[tone] || captionTemplates.Professional,
      cta: ctaOptions[occasion] || 'Visit Now',
      posterText: posterText,
      hashtags: [
        `#${businessName.replace(/\s+/g, '')}`,
        `#${productName.replace(/\s+/g, '')}`,
        `#${occasion.replace(/\s+/g, '')}`,
        `#${businessType}`,
        '#SmallBusiness',
        '#LocalBusiness'
      ].slice(0, 6)
    };
  }
}

export default new PuterAIService();
