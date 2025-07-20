import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PhotoCarousel from "./PhotoCarousel";
import CommentSection from "./CommentSection";
import SEOHead from "./SEOHead";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [photos, setPhotos] = useState([]);
  const [portfolioSettings, setPortfolioSettings] = useState(null);
  const [seoSettings, setSeoSettings] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Default fallback image
  const defaultBackgroundImage = "https://images.unsplash.com/photo-1520166012956-add9ba0835cb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxlbGVjdHJpYyUyMGd1aXRhcnxlbnwwfHx8fDE3NTI5NjAxMzl8MA&ixlib=rb-4.1.0&q=85";

  useEffect(() => {
    Promise.all([
      fetchPhotos(),
      fetchPortfolioSettings(),
      fetchSeoSettings(),
      initializeSampleData()
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API}/photos`);
      setPhotos(response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const fetchPortfolioSettings = async () => {
    try {
      const response = await axios.get(`${API}/portfolio-settings`);
      setPortfolioSettings(response.data);
    } catch (error) {
      console.error("Error fetching portfolio settings:", error);
    }
  };

  const fetchSeoSettings = async () => {
    try {
      const response = await axios.get(`${API}/seo-settings`);
      setSeoSettings(response.data);
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
    }
  };

  const initializeSampleData = async () => {
    try {
      await axios.post(`${API}/init-sample-data`);
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  };

  const currentPhoto = photos[currentPhotoIndex];

  // Get current settings with fallbacks
  const getCurrentAvatar = () => {
    if (portfolioSettings?.avatar_urls && portfolioSettings.avatar_urls[portfolioSettings.selected_avatar_index]) {
      return portfolioSettings.avatar_urls[portfolioSettings.selected_avatar_index];
    }
    return defaultBackgroundImage; // Fallback to default
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-800 text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900">
      {/* SEO Head */}
      <SEOHead 
        portfolioSettings={portfolioSettings}
        seoSettings={seoSettings}
        currentPage="home"
      />
      
      {/* Hero Section */}
      <div 
        className="relative py-20"
        style={{
          background: `linear-gradient(rgba(139, 69, 19, 0.7), rgba(160, 82, 45, 0.7)), url(${defaultBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-8">
            {/* Dynamic Avatar */}
            <img 
              src={getCurrentAvatar()}
              alt="Viet"
              className="w-48 h-48 rounded-full mx-auto mb-4 border-4 border-orange-400 shadow-xl transform hover:scale-110 transition-transform object-cover"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-200 bg-clip-text text-transparent tracking-wide" style={{ fontFamily: 'serif' }}>
              {portfolioSettings?.main_title || "Viet's PortPhotio"}
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
              {portfolioSettings?.main_subtitle || "Hi I'm Viet, welcome."}
            </p>
            <p className="text-lg text-yellow-200 max-w-xl mx-auto italic font-semibold">
              "{portfolioSettings?.main_quote || "Photography is the rhythm that makes memories rock."}"
            </p>
          </div>
          
          {/* Dynamic Equipment Section */}
          <div className="bg-black/80 backdrop-blur-sm p-8 rounded-lg max-w-4xl mx-auto border-2 border-orange-400 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-orange-300 flex items-center justify-center">
              <span className="mr-3">🎸</span>
              {portfolioSettings?.equipment_title || "Electric Guitar Rig"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-orange-100">
              {portfolioSettings?.equipment_items && portfolioSettings.equipment_items.length > 0 ? (
                portfolioSettings.equipment_items.map((item) => (
                  <div key={item.id} className="bg-gray-900/80 p-4 rounded-lg border border-orange-500">
                    <span className="text-orange-400 font-semibold block mb-1">{item.name}:</span> 
                    {item.description}
                  </div>
                ))
              ) : (
                // Fallback default equipment if none are configured
                <>
                  <div className="bg-gray-900/80 p-4 rounded-lg border border-orange-500">
                    <span className="text-orange-400 font-semibold block mb-1">Electric Guitar:</span> 
                    Fender Player Stratocaster HSS
                  </div>
                  <div className="bg-gray-900/80 p-4 rounded-lg border border-orange-500">
                    <span className="text-orange-400 font-semibold block mb-1">Amplifier:</span> 
                    Marshall DSL40CR Tube Amp
                  </div>
                  <div className="bg-gray-900/80 p-4 rounded-lg border border-orange-500">
                    <span className="text-orange-400 font-semibold block mb-1">Distortion Pedal:</span> 
                    Ibanez Tube Screamer TS9
                  </div>
                  <div className="bg-gray-900/80 p-4 rounded-lg border border-orange-500">
                    <span className="text-orange-400 font-semibold block mb-1">Delay Pedal:</span> 
                    Boss DD-7 Digital Delay
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-amber-800">About My Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-lg border-2 border-orange-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-orange-800 mb-3">High-Energy Photography</h3>
              <p className="text-amber-700">
                Capturing dynamic moments with bold compositions that electrify the viewer and create powerful emotional connections.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg shadow-lg border-2 border-yellow-400">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-orange-800 mb-3">Rock & Roll Aesthetics</h3>
              <p className="text-amber-700">
                Bringing the energy of rock music into visual storytelling with dramatic lighting and edgy compositions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-red-50 p-6 rounded-lg shadow-lg border-2 border-red-400">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-orange-800 mb-3">Music-Inspired Visuals</h3>
              <p className="text-amber-700">
                Creating photographs that resonate with rhythm and melody, making every shot feel like a visual symphony.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Carousel */}
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Featured Performances
        </h2>
        <p className="text-center text-amber-700 mb-8 sm:mb-12 text-base sm:text-lg">
          A collection of my most electrifying photographs that capture the energy and soul of every moment
        </p>
        {photos.length > 0 && (
          <PhotoCarousel 
            photos={photos} 
            currentIndex={currentPhotoIndex}
            onIndexChange={setCurrentPhotoIndex}
          />
        )}
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-br from-orange-100 to-red-100 py-16 border-y-2 border-orange-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-orange-800">
            Photography Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-black/90 rounded-lg p-6 shadow-xl border-2 border-orange-500">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">⚡ High-Energy Sessions</h3>
              <p className="text-orange-200 mb-4">
                Dynamic photography sessions that capture your personality with the intensity of a live performance. 
                Perfect for musicians, artists, and anyone who wants bold, electrifying portraits.
              </p>
              <ul className="text-orange-300 space-y-2">
                <li>• Musician portraits & album covers</li>
                <li>• Bold fashion photography</li>
                <li>• Creative artistic headshots</li>
                <li>• Band & group photography</li>
              </ul>
            </div>
            <div className="bg-black/90 rounded-lg p-6 shadow-xl border-2 border-red-500">
              <h3 className="text-2xl font-bold text-red-400 mb-4">🔥 Live Event Coverage</h3>
              <p className="text-red-200 mb-4">
                Capturing the raw energy and electric atmosphere of live events with a rock-and-roll edge 
                that makes every moment feel epic and unforgettable.
              </p>
              <ul className="text-red-300 space-y-2">
                <li>• Concert & live music photography</li>
                <li>• Festival documentation</li>
                <li>• Club & venue events</li>
                <li>• High-energy celebrations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {currentPhoto && (
        <CommentSection photoId={currentPhoto.id} />
      )}

      {/* Footer */}
      <footer className="bg-black py-8 mt-16 border-t-4 border-orange-500">
        <div className="container mx-auto px-4 text-center text-orange-300">
          <p className="mb-2 font-bold">&copy; Viet's Photography Portfolio. All rights reserved.</p>
          <p className="text-sm text-orange-400">
            🎸 {portfolioSettings?.contact_email || "contact@vietsphotography.com"} | 📱 {portfolioSettings?.contact_phone || "(555) ROCK-123"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;