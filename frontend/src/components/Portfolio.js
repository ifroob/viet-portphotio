import React, { useState, useEffect } from "react";
import axios from "axios";
import PhotoCarousel from "./PhotoCarousel";
import CommentSection from "./CommentSection";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Portfolio = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      <div className="bg-gradient-to-r from-black via-purple-900 to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              alt="Brian"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-400 shadow-lg transform hover:scale-110 transition-transform"
            />
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Brian's Digital Lens 📸
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hey there! 👋 I'm Brian, and this is my perspective from behind the lens. 
              Welcome to my digital playground where pixels meet passion! ✨
            </p>
          </div>
          
          {/* Camera Specs */}
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto border border-purple-500/30">
            <h3 className="text-2xl font-semibold mb-4 text-purple-400">🔧 My Tech Arsenal</h3>
            <pre className="text-left text-sm bg-black p-4 rounded overflow-x-auto border border-gray-700">
              <code className="text-green-400">{`
// Brian's Photography Setup 2024 🚀
const myGear = {
  body: "Fujifilm X-T4", // The beast! 💪
  primaryLens: "XF 35mm f/1.4 R", // Portrait magic ✨
  wideAngle: "XF 16-55mm f/2.8 R LM WR", // Landscape hero 🌄
  macroLens: "XF 80mm f/2.8 R LM OIS WR Macro", // Tiny details 🔍
  support: "Gitzo GT3543XLS", // Rock solid 🗿
  filters: "Hoya Pro1 Digital CPL", // Sky enhancer ☀️
  storage: "SanDisk Extreme Pro 128GB", // Speed demon 💨
  software: ["Lightroom Classic", "Photoshop"], // Digital magic 🎨
  coffee: "Essential for late-night editing ☕"
};
              `}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Photo Carousel */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          🎯 Featured Shots
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Every pixel tells a story. Here's mine! 📖✨
        </p>
        {photos.length > 0 && (
          <PhotoCarousel 
            photos={photos} 
            currentIndex={currentPhotoIndex}
            onIndexChange={setCurrentPhotoIndex}
          />
        )}
      </div>

      {/* Comments Section */}
      {currentPhoto && (
        <CommentSection photoId={currentPhoto.id} />
      )}

      {/* Footer */}
      <footer className="bg-black py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Brian's Photography Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;