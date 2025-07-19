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
    <div className="max-w-full mx-auto px-2 sm:px-4">
      {/* Photo Navigation Container */}
      <div className="flex items-center justify-center gap-2 sm:gap-6">
        {/* Left Arrow */}
        <button 
          onClick={prevPhoto}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white p-2 sm:p-3 rounded-full transition-all hover:scale-110 flex-shrink-0 shadow-lg border-2 border-orange-400"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Main Photo Display */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-orange-500/50 flex-1 max-w-full">
          <div className="w-full h-[300px] sm:h-[500px] lg:h-[700px] flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
            <img 
              src={currentPhoto.image_url} 
              alt={currentPhoto.title}
              className="max-w-full max-h-full object-contain"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={nextPhoto}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white p-2 sm:p-3 rounded-full transition-all hover:scale-110 flex-shrink-0 shadow-lg border-2 border-orange-400"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Photo Caption - Below Carousel */}
      <div className="mt-4 sm:mt-6 text-center px-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{currentPhoto.title}</h3>
        <p className="text-amber-700 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">{currentPhoto.description}</p>
      </div>

      {/* Camera Settings */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-4 sm:p-6 border-2 border-orange-500/50 shadow-xl">
        <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-orange-400 flex items-center">
          <span className="mr-2">🎸</span>
          Camera Settings
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {Object.entries(currentPhoto.camera_settings).map(([key, value]) => (
            <div key={key} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-2 sm:p-4 rounded-lg text-center border border-orange-500/30 hover:border-orange-400 transition-all hover:transform hover:scale-105">
              <div className="text-xs sm:text-sm text-amber-400 capitalize font-semibold">{key.replace('_', ' ')}</div>
              <div className="text-sm sm:text-lg lg:text-xl font-bold text-orange-300">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all hover:scale-125 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-400/50' 
                : 'bg-gray-600 hover:bg-orange-300 border border-orange-500/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;