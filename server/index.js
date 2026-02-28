import express from 'express';
import cors from 'cors';
import multer from 'multer';
import puterAI from './puterService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// In-memory storage for generated ads
const generatedAds = [];

// Mock AI generation logic
const generateAdContent = (formData) => {
  const { businessName, businessType, productName, occasion, tone } = formData;
  
  // Generate headline based on inputs
  const headlines = {
    Sale: [
      `Massive Sale at ${businessName}!`,
      `${productName} - Now at Unbeatable Prices!`,
      `Don't Miss Out! ${occasion} ${businessType} Deals`
    ],
    Festival: [
      `Celebrate with ${businessName}!`,
      `Festival Special: ${productName}`,
      `Festive Offers on ${productName} - Limited Time!`
    ],
    'New Launch': [
      `Introducing ${productName} at ${businessName}`,
      `New Arrival: ${productName} is Here!`,
      `Be the First to Try ${productName}!`
    ],
    Offer: [
      `Exclusive Offer: ${productName} at ${businessName}`,
      `Special Deal on ${productName}!`,
      `Limited Time Offer - ${businessName}`
    ]
  };

  const captionTemplates = {
    Professional: `We are excited to bring you ${productName}. Visit ${businessName} and discover quality that speaks for itself.`,
    Fun: `Hey there! Ready for something awesome? ${productName} is waiting for you at ${businessName}! Let's make it happen!`,
    Luxury: `Experience the finest ${productName} at ${businessName}. Where elegance meets excellence.`,
    Local: `Your neighborhood ${businessType}, ${businessName}, brings you ${productName}. Come visit us today!`
  };

  const ctaOptions = {
    Sale: ['Shop Now', 'Grab the Deal', 'Limited Stock - Buy Now'],
    Festival: ['Celebrate with Us', 'Get Festive Offers', 'Visit Today'],
    'New Launch': ['Be the First', 'Try Now', 'Explore Collection'],
    Offer: ['Claim Offer', 'Get Yours Today', 'Don\'t Miss Out']
  };

  // Select random or first option
  const headline = headlines[occasion] ? headlines[occasion][0] : `Check out ${productName} at ${businessName}!`;
  const caption = captionTemplates[tone] || captionTemplates.Professional;
  const cta = ctaOptions[occasion] ? ctaOptions[occasion][0] : 'Visit Now';

  // Generate hashtags
  const hashtags = [
    `#${businessName.replace(/\s+/g, '')}`,
    `#${productName.replace(/\s+/g, '')}`,
    `#${occasion.replace(/\s+/g, '')}`,
    `#${businessType}`,
    '#SmallBusiness',
    '#LocalBusiness',
    '#SupportLocal'
  ].slice(0, 6);

  // Poster data for frontend rendering
  const posterData = {
    businessName,
    productName,
    occasion,
    headline: headline.trim(),
    offerText: occasion === 'Sale' ? 'UP TO 50% OFF' : 'SPECIAL OFFER',
    backgroundColor: tone === 'Luxury' ? '#1a1a2e' : tone === 'Fun' ? '#ff6b6b' : '#4a5568',
    textColor: tone === 'Luxury' ? '#eec643' : '#ffffff',
    businessType
  };

  return {
    headline,
    caption,
    cta,
    hashtags,
    posterData,
    generatedAt: new Date().toISOString()
  };
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'InstaAd AI Server is running' });
});

app.post('/api/generate-ad', upload.single('productImage'), async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.businessName || !formData.productName) {
      return res.status(400).json({ 
        error: 'Business name and product name are required' 
      });
    }

    // Use Gemini 3 Pro via Puter.js for AI content generation
    const adContent = await puterAI.generateAdContentWithGemini(formData);
    
    // Poster data for frontend rendering
    const posterData = {
      businessName: formData.businessName,
      productName: formData.productName,
      occasion: formData.occasion,
      headline: adContent.headline,
      posterText: adContent.posterText || ['SPECIAL OFFER', 'LIMITED TIME'],
      backgroundColor: formData.tone === 'Luxury' ? '#1a1a2e' : formData.tone === 'Fun' ? '#ff6b6b' : '#4a5568',
      textColor: formData.tone === 'Luxury' ? '#eec643' : '#ffffff',
      businessType: formData.businessType
    };

    const result = {
      ...adContent,
      posterData,
      generatedAt: new Date().toISOString()
    };
    
    // Store in memory
    generatedAds.push({
      id: Date.now().toString(),
      formData,
      adContent: result,
      createdAt: new Date()
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error generating ad:', error);
    res.status(500).json({ 
      error: 'Failed to generate ad. Please try again.' 
    });
  }
});

// Get all generated ads (optional - for history)
app.get('/api/ads', (req, res) => {
  res.json({
    success: true,
    count: generatedAds.length,
    ads: generatedAds.slice(-10) // Return last 10
  });
});

// Get AI suggestions using Gemini 3 Pro
app.post('/api/ai-suggestions', async (req, res) => {
  try {
    const formData = req.body;
    
    if (!formData.businessType || !formData.productName) {
      return res.status(400).json({ 
        error: 'Business type and product name are required' 
      });
    }

    const suggestions = await puterAI.getAISuggestions(formData);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to get AI suggestions',
      suggestions: [
        'Try adding urgency with limited-time offers',
        'Include customer testimonials for trust',
        'Use vibrant colors to catch attention'
      ]
    });
  }
});

// Generate image using Veo 3
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, businessName } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
      });
    }

    const imageUrl = await puterAI.generateImageWithVeo3(prompt, businessName);
    
    res.json({
      success: true,
      imageUrl,
      message: imageUrl ? 'Image generated successfully' : 'Image generation in progress'
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image. Please try again.' 
    });
  }
});

// Generate video using Veo 3 Fast Audio
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, businessName, duration = 5 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
      });
    }

    const videoData = await puterAI.generateVideoWithVeo3(prompt, businessName, duration);
    
    res.json({
      success: videoData.status === 'completed',
      videoUrl: videoData.videoUrl,
      audioUrl: videoData.audioUrl,
      status: videoData.status,
      message: videoData.status === 'completed' 
        ? 'Video generated successfully' 
        : 'Video generation in progress'
    });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video. Please try again.',
      status: 'failed'
    });
  }
});

// Get templates
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 1,
      name: 'Restaurant Sale',
      category: 'Restaurant',
      data: {
        businessType: 'Restaurant',
        occasion: 'Sale',
        tone: 'Fun',
        productName: 'Delicious Meals'
      }
    },
    {
      id: 2,
      name: 'Fashion Discount',
      category: 'Clothing',
      data: {
        businessType: 'Clothing',
        occasion: 'Sale',
        tone: 'Professional',
        productName: 'Latest Collection'
      }
    },
    {
      id: 3,
      name: 'Grand Opening',
      category: 'General',
      data: {
        businessType: 'Other',
        occasion: 'New Launch',
        tone: 'Fun',
        productName: 'Our Services'
      }
    },
    {
      id: 4,
      name: 'Salon Special',
      category: 'Salon',
      data: {
        businessType: 'Salon',
        occasion: 'Offer',
        tone: 'Luxury',
        productName: 'Hair & Beauty Services'
      }
    },
    {
      id: 5,
      name: 'Electronics Deal',
      category: 'Electronics',
      data: {
        businessType: 'Electronics',
        occasion: 'Sale',
        tone: 'Professional',
        productName: 'Smartphones & Gadgets'
      }
    },
    {
      id: 6,
      name: 'Festival Offer',
      category: 'General',
      data: {
        businessType: 'Other',
        occasion: 'Festival',
        tone: 'Fun',
        productName: 'Special Products'
      }
    }
  ];

  res.json({
    success: true,
    templates
  });
});

// Start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`InstaAd AI Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
}

export default app;
