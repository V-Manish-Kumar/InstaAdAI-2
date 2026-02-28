// Puter.js AI Utility Functions
// Documentation: https://developer.puter.com/ai/google/
// No API key required - Uses client-side authentication

/**
 * Check if Puter.js SDK is loaded and ready
 */
export const checkPuterReady = () => {
  const isReady = typeof window !== 'undefined' && window.puter && window.puter.ai;
  
  if (isReady && window.puter.ai) {
    // Log available methods for debugging
    console.log('Puter.ai methods:', Object.keys(window.puter.ai));
  }
  
  return isReady;
};

/**
 * Initialize Puter.js SDK
 */
export const initializePuter = () => {
  if (checkPuterReady()) {
    console.log('Puter.js SDK loaded successfully');
    return true;
  }
  console.log('Waiting for Puter.js SDK to load...');
  return false;
};

/**
 * Get available Puter.js AI capabilities
 */
export const getPuterCapabilities = () => {
  if (!checkPuterReady()) {
    return { available: false };
  }
  
  const caps = {
    available: true,
    chat: typeof window.puter.ai.chat === 'function',
    txt2img: typeof window.puter.ai.txt2img === 'function',
    txt2video: typeof window.puter.ai.txt2video === 'function',
    allMethods: Object.keys(window.puter.ai || {}),
    puterVersion: window.puter?.version || 'unknown'
  };
  
  console.log('Puter capabilities:', caps);
  return caps;
};

/**
 * Test Puter.js connection with a simple query
 */
export const testPuterConnection = async () => {
  if (!checkPuterReady()) {
    return { success: false, error: 'SDK not loaded' };
  }
  
  try {
    console.log('Testing Puter.js connection...');
    
    // Try a very simple test
    const testMessage = 'Say hello in one word';
    const response = await window.puter.ai.chat(testMessage, {
      model: 'gemini-pro'
    });
    
    console.log('Test successful:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Chat with Gemini 3 Pro
 * TEMPORARILY DISABLED
 * @param {string|Array} messages - User message or array of messages
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} AI response
 */
export const chatWithGemini = async (messages, options = {}) => {
  throw new Error('AI chat functionality is temporarily disabled');
  
  /* DISABLED
  if (!checkPuterReady()) {
    throw new Error('Puter.js SDK not loaded');
  }

  try {
    console.log('Calling Gemini...');
    console.log('Input:', typeof messages === 'string' ? messages.substring(0, 100) + '...' : messages);
    
    // Try multiple model variations
    const modelVariants = [
      'gemini-pro',
      'google:gemini-pro',
      'gemini-3.0-pro',
      'google:gemini-3.0-pro',
      'gemini-1.5-pro'
    ];

    let lastError = null;
    
    for (const modelName of modelVariants) {
      try {
        console.log(`Trying model: ${modelName}`);
        
        // Try different call patterns
        let response;
        
        // Pattern 1: Simple string message
        if (typeof messages === 'string') {
          response = await window.puter.ai.chat(messages, {
            model: modelName,
            stream: false,
            ...options
          });
        } 
        // Pattern 2: Message array
        else {
          const messageArray = Array.isArray(messages) ? messages : [{ role: 'user', content: messages }];
          response = await window.puter.ai.chat(messageArray, {
            model: modelName,
            stream: false,
            ...options
          });
        }

        console.log('Success with model:', modelName);
        console.log('Response type:', typeof response);
        console.log('Response:', response);

        // Handle different response formats
        let content = '';
        if (typeof response === 'string') {
          content = response;
        } else if (response.message?.content) {
          content = response.message.content;
        } else if (response.content) {
          content = response.content;
        } else if (response.text) {
          content = response.text;
        } else if (response.choices?.[0]?.message?.content) {
          content = response.choices[0].message.content;
        } else {
          content = JSON.stringify(response);
        }

        return {
          content: content,
          message: { content: content }
        };
      } catch (error) {
        console.log(`Model ${modelName} failed:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    throw lastError || new Error('All model variants failed');
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Error response:', error.response);
    }
    throw new Error(`AI chat failed: ${error.message || 'Unknown error'}`);
  }
  */
};

/**
 * Generate ad content using Gemini 3 Pro
 * TEMPORARILY DISABLED
 * @param {Object} formData - Business information
 * @returns {Promise<Object>} Generated ad content
 */
export const generateAdContentWithGemini = async (formData) => {
  throw new Error('AI ad generation is temporarily disabled');
  
  /* DISABLED
  const { businessName, businessType, productName, occasion, tone } = formData;

  const prompt = `You are an expert marketing copywriter. Create compelling ad content for a small business.

Business Details:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Product/Service: ${productName}
- Occasion: ${occasion}
- Tone: ${tone}

Generate:
1. A catchy headline (max 80 characters)
2. An engaging caption (2-3 sentences)
3. A strong call-to-action (3-5 words)
4. 6 relevant hashtags

Respond ONLY with valid JSON in this exact format:
{
  "headline": "your headline here",
  "caption": "your caption here",
  "cta": "your cta here",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"]
}`;

  try {
    console.log('Generating ad content...');
    const response = await chatWithGemini(prompt);
    const content = response.content || response.message?.content || '';
    
    console.log('Raw response:', content);
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const adContent = JSON.parse(jsonMatch[0]);
      console.log('Parsed ad content:', adContent);
      return adContent;
    }
    
    throw new Error('Invalid response format - no JSON found');
  } catch (error) {
    console.error('Ad Content Generation Error:', error);
    throw new Error(`Failed to generate ad content: ${error.message || 'Unknown error'}`);
  }
  */
};

/**
 * Generate marketing suggestions using Gemini 3 Pro
 * TEMPORARILY DISABLED
 * @param {Object} formData - Business information
 * @returns {Promise<Array>} Array of suggestions
 */
export const getAISuggestions = async (formData) => {
  throw new Error('AI suggestions are temporarily disabled');
};

/**
 * Generate image using Gemini 3 Pro (Imagen 3)
 * TEMPORARILY DISABLED
 * Documentation: https://developer.puter.com/ai/google/imagen-3.0/
 * @param {string} prompt - Image description
 * @param {string} businessName - Business name for context
 * @returns {Promise<string>} Image URL or data URL
 */
export const generateImageWithGemini = async (prompt, businessName) => {
  throw new Error('AI image generation is temporarily disabled');
  
  /* DISABLED
  if (!checkPuterReady()) {
    throw new Error('Puter.js SDK not loaded');
  }

  try {
    console.log('Generating image with Imagen 3.0...');
    
    const enhancedPrompt = `Professional marketing poster for ${businessName}: ${prompt}. High quality, modern design, commercial photography style, vibrant colors, professional layout, eye-catching.`;

    console.log('Prompt:', enhancedPrompt);

    const response = await window.puter.ai.txt2img(enhancedPrompt, {
      model: 'google:imagen-3.0',
      size: '1024x1024'
    });

    console.log('Image response:', response);

    // Handle different response formats
    if (typeof response === 'string') {
      return response;
    } else if (response.url) {
      return response.url;
    } else if (response.data) {
      return response.data;
    } else if (response instanceof Blob) {
      // Convert blob to data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(response);
      });
    }

    throw new Error('Unexpected response format from image generation');
  } catch (error) {
    console.error('Image Generation Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Image generation failed: ${error.message || 'Unknown error'}`);
  }
  */
};

/**
 * Generate video with audio using Veo 3 Fast Audio
 * TEMPORARILY DISABLED
 * Documentation: https://developer.puter.com/ai/google/veo-3.0-fast-audio/
 * @param {string} prompt - Video description
 * @param {string} businessName - Business name for context
 * @param {number} duration - Video duration in seconds (default 5)
 * @returns {Promise<Object>} Video data with URL
 */
export const generateVideoWithVeo3 = async (prompt, businessName, duration = 5) => {
  throw new Error('AI video generation is temporarily disabled');
  
  /* DISABLED
  if (!checkPuterReady()) {
    throw new Error('Puter.js SDK not loaded');
  }

  try {
    console.log('Generating video with Veo 3.0 Fast Audio...');
    
    const enhancedPrompt = `Create a ${duration}-second promotional video for ${businessName}: ${prompt}. Professional, engaging, smooth transitions, vibrant colors, modern style, dynamic camera movements, high quality production.`;

    console.log('Prompt:', enhancedPrompt);

    const response = await window.puter.ai.txt2video(enhancedPrompt, {
      model: 'google:veo-3.0-fast-audio',
      duration: duration,
      ratio: '16:9',
      include_audio: true
    });

    console.log('Video response:', response);

    // Handle different response formats
    if (typeof response === 'string') {
      return { videoUrl: response, status: 'completed' };
    } else if (response.url) {
      return { 
        videoUrl: response.url, 
        audioUrl: response.audio_url,
        status: 'completed' 
      };
    } else if (response.data) {
      return { videoUrl: response.data, status: 'completed' };
    } else if (response instanceof Blob) {
      // Convert blob to data URL
      const videoUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(response);
      });
      return { videoUrl, status: 'completed' };
    }

    throw new Error('Unexpected response format from video generation');
  } catch (error) {
    console.error('Video Generation Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Video generation failed: ${error.message || 'Unknown error'}`);
  }
  */
};

/**
 * Wait for Puter.js to be ready with timeout
 * @param {number} timeout - Maximum wait time in ms (default 5000)
 * @returns {Promise<boolean>} True if ready, false if timeout
 */
export const waitForPuter = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (checkPuterReady()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (checkPuterReady()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

export default {
  initializePuter,
  checkPuterReady,
  getPuterCapabilities,
  testPuterConnection,
  chatWithGemini,
  generateAdContentWithGemini,
  getAISuggestions,
  generateImageWithGemini,
  generateVideoWithVeo3,
  waitForPuter
}
