import { Sparkles, Zap, Clock, TrendingUp, ArrowRight, MessageCircle, Image as ImageIcon, Video } from 'lucide-react'

export default function LandingPage({ onNavigate, onNavigateToChatbot, onNavigateToImageGen, onNavigateToVideoGen }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Ad Generation
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Create Posters, Images & Videos for Your Business{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                in Minutes
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
              No design skills needed. Just enter your business details and let AI create stunning marketing materials for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <button onClick={onNavigate} className="btn-primary group">
                Start Creating
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onNavigateToImageGen} className="btn-secondary group">
                <ImageIcon className="inline-block mr-2 w-5 h-5" />
                AI Image Generator
              </button>
              <button onClick={() => alert('This feature will come soon')} className="btn-secondary group">
                <Video className="inline-block mr-2 w-5 h-5" />
                AI Video Generator
              </button>
              <button onClick={onNavigateToChatbot} className="btn-secondary group">
                <MessageCircle className="inline-block mr-2 w-5 h-5" />
                AI Chatbot
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">2 Min</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ads Created</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Market Your Business
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed specifically for small businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="AI-Powered Generation"
              description="Our AI creates professional ad copy, headlines, and call-to-actions tailored to your business."
            />
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8" />}
              title="AI Image Generator"
              description="Generate stunning images from text descriptions using advanced AI. Create custom visuals for any marketing need."
              highlight={true}
            />
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="AI Chatbot Assistant"
              description="Get instant help with marketing strategies, content ideas, and business advice from our AI chatbot powered by Google Gemini."
              highlight={true}
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Save Hours"
              description="What used to take hours now takes minutes. Focus on your business, not design."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Boost Engagement"
              description="Get professionally designed ads that drive clicks and conversions."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Multiple Formats"
              description="Generate posters, social media images, and video content from one input."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Pre-made Templates"
              description="Start with industry-specific templates for restaurants, salons, retail, and more."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Three simple steps to your perfect ad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Enter Details"
              description="Fill in your business name, product, and occasion in a simple form."
            />
            <StepCard
              number="2"
              title="AI Generates"
              description="Our AI creates multiple ad variations with copy, images, and hashtags."
            />
            <StepCard
              number="3"
              title="Download & Share"
              description="Download your ad and share it across all your marketing channels."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of small businesses creating professional ads in minutes
          </p>
          <button onClick={onNavigate} className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">InstaAd AI</h3>
              <p className="text-sm">Marketing made easy for small businesses.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 InstaAd AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, highlight }) {
  return (
    <div className={`card hover:shadow-xl transition-all duration-300 group ${
      highlight ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-primary-50 dark:from-purple-900/20 dark:to-primary-900/20' : ''
    }`}>
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
        highlight 
          ? 'bg-gradient-to-br from-purple-600 to-primary-600 text-white' 
          : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
      }`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
      {highlight && (
        <div className="mt-3 inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400">
          <Sparkles className="w-4 h-4 mr-1" />
          New Feature
        </div>
      )}
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

