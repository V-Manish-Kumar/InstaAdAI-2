# InstaAd AI - Marketing Ad Generator

![InstaAd AI](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Live](https://img.shields.io/badge/Live-Vercel-brightgreen.svg)

**Live Demo: [https://insta-ad-ai-2.vercel.app/](https://insta-ad-ai-2.vercel.app/)**

**Create Posters, Images & Videos for Your Business in Minutes**

A modern full-stack web application that helps small businesses generate professional marketing ads using AI technology. Built with React, Node.js, and Tailwind CSS.

## Features

- **Modern Landing Page** - Professional SaaS-style homepage with hero section, features, pricing, and testimonials
- **AI-Powered Ad Generation** - Generate headlines, captions, CTAs, and hashtags instantly using **Gemini 3 Pro**
- **AI Chat Assistant** - Interactive chat powered by **Gemini 3 Pro via Puter.js** for marketing advice
- **AI Suggestions** - Get real-time marketing tips and recommendations from AI
- **AI Video Generation** - Create professional videos with audio using **Google Veo 3 Fast Audio**
- **AI Image Generation** - Generate marketing images using **Google Veo 3**
- **Visual Poster Creator** - Create eye-catching posters with customizable designs
- **Mobile Responsive** - Works seamlessly across all devices
- **Dark/Light Mode** - Toggle between themes with system preference detection
- **Quick Templates** - Pre-built templates for different industries
- **Download Options** - Export posters as PNG images and videos as MP4
- **Copy to Clipboard** - Easy copy functionality for ad content

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **html2canvas** - Poster download functionality
- **Puter.js** - AI SDK for accessing Google's AI models

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for API requests

### AI Services (via Puter.js)
- **Google Gemini 3 Pro** - Advanced language model for content generation and chat
- **Google Veo 3 Fast Audio** - Video and image generation with audio support

## Project Structure

```
InstaAD/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdGeneratorForm.jsx
│   │   │   ├── AdOutput.jsx
│   │   │   └── TemplatesSidebar.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.cjs
├── server/                # Backend Express server
│   └── index.js          # API endpoints and server logic
├── package.json          # Root package.json
└── README.md            # This file
```

## Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd InstaAD
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Run Both Server and Client Together (Recommended)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

#### Option 2: Run Separately

**Terminal 1 - Start Backend:**
```bash
npm run server
```

**Terminal 2 - Start Frontend:**
```bash
npm run client
```

### Access the Application

Open your browser and go to:
```
http://localhost:5173
```

### Optional: Configure Puter.js API Key

For enhanced AI features, you can optionally add a Puter.js API key:

1. Visit [Puter.com](https://puter.com/) and create an account
2. Get your API key from the dashboard
3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
4. Add your API key:
   ```
   PUTER_API_KEY=your_actual_api_key_here
   ```

**Note:** The application works without an API key using client-side authentication. The API key is only needed for server-side AI calls.

## Usage Guide

### 1. Landing Page
- View all features, pricing, and testimonials
- Click **"Start Creating"** to access the dashboard

### 2. Ad Generator Dashboard

#### Fill the Form:
- **Business Name*** (required) - Your business name
- **Business Type** - Restaurant, Clothing, Salon, Electronics, or Other
- **Product/Service Name*** (required) - What you're advertising
- **Occasion** - Sale, Festival, New Launch, Offer, or Custom
- **Tone** - Professional, Fun, Luxury, or Local
- **Language** - English, Hindi, Spanish, French
- **Product Image** (optional) - Upload a product photo

#### Generate Ad:
Click the **"Generate Ad"** button to create your marketing content

### 3. Templates Sidebar
- Click any template to auto-fill the form
- Pre-configured for different business types

### 4. Output Section
Once generated, you'll see:
- **Ad Ideas**: Headline, caption, CTA, and hashtags
- **Poster Preview**: Visual design you can download
- **Video Preview**: Placeholder for future video generation
- Copy buttons for easy sharing

### 5. Dark Mode
- Click the moon/sun icon in the top right to toggle themes
- Preference is saved in local storage

### 6. AI Features

#### AI Chat Assistant
- Click the purple chat bubble in the bottom-right corner
- Ask questions about marketing, ad strategies, or business growth
- Powered by Gemini 3 Pro for intelligent responses

#### AI Suggestions
- Automatically get AI-powered marketing tips as you fill the form
- Get personalized recommendations for your business type
- Click refresh to get new suggestions

#### Generate AI Images
- After generating ad content, scroll to the AI Image Generator section
- Click "Generate AI Image" to create professional marketing visuals
- Uses Google Veo 3 for high-quality image generation

#### Generate AI Videos
- Scroll to the Video Generator section in the output
- Click "Generate AI Video" to create a video ad with audio
- Uses Google Veo 3 Fast Audio (takes 1-2 minutes)
- Download the generated video with built-in voiceover

## Customization

### Modify Color Scheme
Edit [client/tailwind.config.js](client/tailwind.config.js):
```javascript
colors: {
  primary: {
    // Change these values
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  }
}
```

### Add More Templates
Edit [server/index.js](server/index.js) - find the `/api/templates` endpoint:
```javascript
const templates = [
  {
    id: 7,
    name: 'Your Template',
    category: 'Your Category',
    data: {
      businessType: 'Type',
      occasion: 'Occasion',
      tone: 'Tone',
      productName: 'Product'
    }
  }
]
```

### Customize AI Responses
Modify the `generateAdContent` function in [server/index.js](server/index.js)

## Building for Production

### Build Frontend:
```bash
cd client
npm run build
```

This creates a `client/dist` folder with optimized production files.

### Serve Production Build:
You can serve the built files with any static host or configure Express to serve them:
```javascript
app.use(express.static('client/dist'))
```

## API Endpoints

### GET `/api/health`
Returns server health status

### POST `/api/generate-ad`
Generate ad content using AI
- **Body**: FormData with business details
- **Returns**: AI-generated headlines, captions, hashtags, poster data
- **AI**: Uses Gemini 3 Pro via Puter.js

### POST `/api/ai-suggestions`
Get AI marketing suggestions
- **Body**: JSON with businessType, productName, occasion
- **Returns**: Array of 3 AI-generated marketing tips
- **AI**: Uses Gemini 3 Pro via Puter.js

### POST `/api/generate-image`
Generate AI image
- **Body**: JSON with prompt, businessName
- **Returns**: Image URL
- **AI**: Uses Google Veo 3

### POST `/api/generate-video`
Generate AI video with audio
- **Body**: JSON with prompt, businessName, duration
- **Returns**: Video URL, audio URL, status
- **AI**: Uses Google Veo 3 Fast Audio

### GET `/api/templates`
Get all available templates
- **Returns**: Array of template objects

### GET `/api/ads`
Get recently generated ads (last 10)
- **Returns**: Array of ad objects

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is in use, modify:
- Backend: Change `PORT` in [server/index.js](server/index.js)
- Frontend: Change `port` in [client/vite.config.js](client/vite.config.js)

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

### Styles Not Loading
```bash
cd client
npm run build
```

### Dark Mode Not Persisting
Check browser's local storage - ensure it's not disabled

## Future Enhancements

- [x] Real AI integration (Gemini 3 Pro via Puter.js) ✅
- [x] Real video generation (Veo 3 Fast Audio) ✅
- [x] AI chat assistant ✅
- [x] AI-powered suggestions ✅
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Save ad history per user
- [ ] Export to multiple formats (PDF, SVG)
- [ ] Social media scheduling
- [ ] Analytics dashboard
- [ ] Multi-language support expansion
- [ ] Custom branding options
- [ ] Batch ad generation
- [ ] A/B testing for ads

## Notes

- **AI Integration**: Uses **Puter.js SDK** with **Google Gemini 3 Pro** for intelligent content generation and chat
- **Video/Image Generation**: Powered by **Google Veo 3 Fast Audio** via Puter.js
- **No database** - uses in-memory storage (data resets on server restart)
- Video and image generation may take 1-2 minutes depending on complexity
- The AI chat assistant works directly in the browser via Puter.js SDK
- Fallback responses are provided if AI services are temporarily unavailable

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support

For issues or questions:
- Create an issue in the repository
- Check existing issues for solutions

---

**Built with for small businesses**

Happy Marketing!
