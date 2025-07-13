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
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-blue-500/30">
        <img 
          src={currentPhoto.image_url} 
          alt={currentPhoto.title}
          className="w-full h-[600px] object-cover"
        />
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevPhoto}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-4 rounded-full transition-all hover:scale-110"
        >
          ← Prev
        </button>
        <button 
          onClick={nextPhoto}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-4 rounded-full transition-all hover:scale-110"
        >
          Next →
        </button>

        {/* Photo Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
          <h3 className="text-3xl font-bold mb-2 text-blue-400">{currentPhoto.title}</h3>
          <p className="text-gray-300 mb-4 text-lg">{currentPhoto.description}</p>
        </div>
      </div>

      {/* Camera Settings */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-blue-500/30">
        <h4 className="text-2xl font-semibold mb-4 text-blue-400">Camera Settings</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(currentPhoto.camera_settings).map(([key, value]) => (
            <div key={key} className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600 hover:border-blue-500 transition-colors">
              <div className="text-sm text-gray-400 capitalize font-semibold">{key.replace('_', ' ')}</div>
              <div className="text-xl font-bold text-blue-300">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-8 space-x-3">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-4 h-4 rounded-full transition-all hover:scale-125 ${
              index === currentIndex ? 'bg-purple-400 shadow-lg shadow-purple-400/50' : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;