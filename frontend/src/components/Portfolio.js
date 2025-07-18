import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PhotoCarousel from "./PhotoCarousel";
import CommentSection from "./CommentSection";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Placeholder background image - change this URL to update the background
  const backgroundImage = "https://portphotio.s3.us-east-1.amazonaws.com/DSCF3849.JPG";

  useEffect(() => {
    fetchPhotos();
    initializeSampleData();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API}/photos`);
      setPhotos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div 
        className="relative py-20"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-8">
            <img 
              src="https://portphotio.s3.us-east-1.amazonaws.com/me.png"
              alt="Brian"
              className="w-48 h-48 rounded-full mx-auto mb-4 border-4 border-blue-400 shadow-lg transform hover:scale-110 transition-transform"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent italic" style={{ fontFamily: 'cursive' }}>
              Brian's PortPhotio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Casual photographer messing around with photography. I shoot anything involving my interests! Friends, family, nature, travel, hobbies.
              I got tired of Instagram throttling the resolution of my photos, so I decided to create this Portphotio.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link 
              to="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors transform hover:scale-105"
            >
              📖 Photography Blog
            </Link>
            <Link 
              to="/photos" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors transform hover:scale-105"
            >
              📸 More Photos
            </Link>
            <Link 
              to="/tweaker" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors transform hover:scale-105"
            >
              🎛️ Recipe Tweaker
            </Link>
          </div>
          
          {/* Camera Specs */}
          <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg max-w-4xl mx-auto border border-blue-500/30">
            <h3 className="text-m font-semibold mb-4 text-blue-400">Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <span className="text-gray-400">Camera Body:</span> Fujifilm XS20
              </div>
              <div>
                <span className="text-gray-400">Primary Lens:</span> Tamron 17-70mm f/2.8 Di III-A VC RXD
              </div>
              <div>
                <span className="text-gray-400">Zoom Lens:</span> XC 50-230mm f/4.5-6.7 OIS II
              </div>
              <div>
                <span className="text-gray-400">Macro Lens:</span> XF 90mm f/2 R LM WR
              </div>
              <div>
                <span className="text-gray-400">Fisheye Lens:</span> Canon 8-15mm f/4L Fisheye USM
              </div>
              <div>
                <span className="text-gray-400">Recipes:</span> TBD -- I tend to use Fuji Recipes found online.
              </div>
              <div>
                <span className="text-gray-400">Storage:</span> SanDisk Extreme Pro 128GB
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Carousel */}
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Featured Work
        </h2>
        <p className="text-center text-gray-400 mb-8 sm:mb-12 text-base sm:text-lg">
          Photography Portphotio
        </p>
        {photos.length > 0 && (
          <PhotoCarousel 
            photos={photos} 
            currentIndex={currentPhotoIndex}
            onIndexChange={setCurrentPhotoIndex}
          />
        )}
      </div>

      {/* Section Links */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Explore More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link 
              to="/blog" 
              className="group bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">Photography Blog</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Read about my personal photography journey, tips, and experiences in the world of photography.
                </p>
                <span className="text-blue-400 group-hover:text-blue-300 font-medium">
                  Explore Articles →
                </span>
              </div>
            </Link>

            <Link 
              to="/photos" 
              className="group bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">More Photos</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Browse through my extended collection of photographs organized by category and style.
                </p>
                <span className="text-blue-400 group-hover:text-blue-300 font-medium">
                  View Gallery →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {currentPhoto && (
        <CommentSection photoId={currentPhoto.id} />
      )}

      {/* Footer */}
      <footer className="bg-black py-8 mt-16 border-t border-blue-500/30">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; Brian's Photography PortPhotio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;