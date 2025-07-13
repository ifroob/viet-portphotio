import React from "react";

const PhotoCarousel = ({ photos, currentIndex, onIndexChange }) => {
  const currentPhoto = photos[currentIndex];

  const nextPhoto = () => {
    onIndexChange((currentIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  };

  if (!currentPhoto) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Photo Display */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <img 
          src={currentPhoto.image_url} 
          alt={currentPhoto.title}
          className="w-full h-96 object-cover"
        />
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevPhoto}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
        >
          ←
        </button>
        <button 
          onClick={nextPhoto}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
        >
          →
        </button>

        {/* Photo Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h3 className="text-2xl font-bold mb-2">{currentPhoto.title}</h3>
          <p className="text-gray-300 mb-4">{currentPhoto.description}</p>
        </div>
      </div>

      {/* Camera Settings */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h4 className="text-xl font-semibold mb-4">Camera Settings</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(currentPhoto.camera_settings).map(([key, value]) => (
            <div key={key} className="bg-gray-700 p-3 rounded text-center">
              <div className="text-sm text-gray-400 capitalize">{key.replace('_', ' ')}</div>
              <div className="text-lg font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-8 space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;