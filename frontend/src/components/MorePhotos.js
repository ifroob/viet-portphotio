import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MorePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPhotos = async () => {
    try {
      let url = `${API}/gallery?limit=50`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await axios.get(url);
      setPhotos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery photos:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/gallery/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    }
  };

  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedPhoto]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-800 text-xl">Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-200 py-16 border-b-2 border-amber-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            More Photos
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Explore my extended collection of photography work across different categories and styles.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === ""
                ? "bg-amber-600 text-white shadow-lg"
                : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-200"
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.category
                  ? "bg-amber-600 text-white shadow-lg"
                  : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              {category.category} ({category.count})
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-amber-200"
              onClick={() => openLightbox(photo)}
            >
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-amber-900 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900 via-amber-800 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-sm font-medium truncate">{photo.title}</h3>
                <p className="text-amber-200 text-xs capitalize">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-600 text-lg">
              {selectedCategory ? 'No photos found in this category.' : 'No photos available.'}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-amber-900 bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-amber-200 transition-colors z-10 bg-amber-800 bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-amber-200 transition-colors z-10 bg-amber-800 bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-amber-200 transition-colors z-10 bg-amber-800 bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Photo Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-amber-900 bg-opacity-90 rounded-lg p-4 border border-amber-600">
              <h3 className="text-white text-lg font-bold mb-2">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-amber-200 text-sm mb-2">{selectedPhoto.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-amber-300 text-sm capitalize">{selectedPhoto.category}</span>
                <span className="text-amber-400 text-sm">
                  {photos.findIndex(p => p.id === selectedPhoto.id) + 1} / {photos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MorePhotos;