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
  const [backgroundImage, setBackgroundImage] = useState('');

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

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
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
      <div className="bg-gradient-to-r from-black via-blue-900 to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              alt="Brian"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-400 shadow-lg transform hover:scale-110 transition-transform"
            />
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Brian's Portfolio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional photographer specializing in portrait and landscape photography.
            </p>
          </div>
          
          {/* Camera Specs */}
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto border border-blue-500/30">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <span className="text-gray-400">Camera Body:</span> Fujifilm X-T4
              </div>
              <div>
                <span className="text-gray-400">Primary Lens:</span> XF 35mm f/1.4 R
              </div>
              <div>
                <span className="text-gray-400">Zoom Lens:</span> XF 16-55mm f/2.8 R LM WR
              </div>
              <div>
                <span className="text-gray-400">Macro Lens:</span> XF 80mm f/2.8 R LM OIS WR
              </div>
              <div>
                <span className="text-gray-400">Tripod:</span> Gitzo GT3543XLS
              </div>
              <div>
                <span className="text-gray-400">Filters:</span> Hoya Pro1 Digital CPL
              </div>
              <div>
                <span className="text-gray-400">Storage:</span> SanDisk Extreme Pro 128GB
              </div>
              <div>
                <span className="text-gray-400">Software:</span> Lightroom Classic, Photoshop
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Carousel */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Featured Work
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Professional photography portfolio
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
      <footer className="bg-black py-8 mt-16 border-t border-blue-500/30">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Brian's Photography Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;