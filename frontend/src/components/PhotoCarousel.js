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
      {/* Photo Navigation Container */}
      <div className="flex items-center justify-center gap-6">
        {/* Left Arrow */}
        <button 
          onClick={prevPhoto}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all hover:scale-110 flex-shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Main Photo Display */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-blue-500/30 flex-1">
          <div className="w-full h-[700px] flex items-center justify-center bg-black">
            <img 
              src={currentPhoto.image_url} 
              alt={currentPhoto.title}
              className="max-w-full max-h-full object-contain"
              style={{
                maxWidth: '100%',
                maxHeight: '700px',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={nextPhoto}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all hover:scale-110 flex-shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Photo Caption - Below Carousel */}
      <div className="mt-6 text-center">
        <h3 className="text-3xl font-bold mb-2 text-blue-400">{currentPhoto.title}</h3>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">{currentPhoto.description}</p>
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
              index === currentIndex ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;