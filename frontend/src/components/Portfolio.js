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
      <div className="bg-gradient-to-r from-black to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              alt="Brian"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
            <h1 className="text-5xl font-bold mb-4">Brian's Portfolio</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hi I'm Brian and this is my perspective from my setup
            </p>
          </div>
          
          {/* Camera Specs */}
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Camera Setup</h3>
            <pre className="text-left text-sm bg-black p-4 rounded overflow-x-auto">
              <code>{`
Body: Fujifilm X-T4
Primary Lens: XF 35mm f/1.4 R
Secondary Lens: XF 16-55mm f/2.8 R LM WR
Macro Lens: XF 80mm f/2.8 R LM OIS WR Macro
Tripod: Gitzo GT3543XLS
Filters: Hoya Pro1 Digital CPL
Memory: SanDisk Extreme Pro 128GB
Software: Lightroom Classic, Photoshop
              `}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Photo Carousel */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Work</h2>
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