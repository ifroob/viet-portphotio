import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuickUpload = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Featured Photos Form
  const [featuredPhoto, setFeaturedPhoto] = useState({
    title: '',
    description: '',
    image_url: '',
    camera_settings: {
      aperture: '',
      shutter_speed: '',
      iso: '',
      lens: '',
      focal_length: ''
    }
  });

  // Gallery Photo Form
  const [galleryPhoto, setGalleryPhoto] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general'
  });

  const resetForms = () => {
    setFeaturedPhoto({
      title: '',
      description: '',
      image_url: '',
      camera_settings: {
        aperture: '',
        shutter_speed: '',
        iso: '',
        lens: '',
        focal_length: ''
      }
    });
    
    setGalleryPhoto({
      title: '',
      description: '',
      image_url: '',
      category: 'general'
    });
  };

  const showMessage = (message, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
    
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  const handleFeaturedSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/photos`, featuredPhoto);
      showMessage('Featured photo uploaded successfully!');
      resetForms();
    } catch (error) {
      console.error('Error uploading featured photo:', error);
      showMessage('Error uploading featured photo. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/gallery`, galleryPhoto);
      showMessage('Gallery photo uploaded successfully!');
      resetForms();
    } catch (error) {
      console.error('Error uploading gallery photo:', error);
      showMessage('Error uploading gallery photo. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraSettingChange = (key, value) => {
    setFeaturedPhoto(prev => ({
      ...prev,
      camera_settings: {
        ...prev.camera_settings,
        [key]: value
      }
    }));
  };

  const categories = [
    'general', 'portrait', 'landscape', 'street', 'architecture', 
    'macro', 'wedding', 'urban', 'abstract', 'nature'
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Quick Photo Upload</h2>
          <p className="text-gray-400">Easily upload photos from your S3 bucket to featured or gallery sections</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-600/20 border border-green-600/50 text-green-400 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 bg-red-600/20 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'featured'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">⭐</span>
              Featured Photos (Main Portfolio)
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">🖼️</span>
              Gallery Photos (More Photos)
            </button>
          </div>

          <div className="p-6">
            {/* Featured Photos Form */}
            {activeTab === 'featured' && (
              <form onSubmit={handleFeaturedSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Photo Title *
                    </label>
                    <input
                      type="text"
                      value={featuredPhoto.title}
                      onChange={(e) => setFeaturedPhoto({...featuredPhoto, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter photo title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      S3 Image URL *
                    </label>
                    <input
                      type="url"
                      value={featuredPhoto.image_url}
                      onChange={(e) => setFeaturedPhoto({...featuredPhoto, image_url: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://your-bucket.s3.amazonaws.com/photo.jpg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={featuredPhoto.description}
                    onChange={(e) => setFeaturedPhoto({...featuredPhoto, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the photo..."
                    required
                  />
                </div>

                {/* Camera Settings */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-200 mb-4">Camera Settings (Optional)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={featuredPhoto.camera_settings.aperture}
                      onChange={(e) => handleCameraSettingChange('aperture', e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Aperture (f/2.8)"
                    />
                    <input
                      type="text"
                      value={featuredPhoto.camera_settings.shutter_speed}
                      onChange={(e) => handleCameraSettingChange('shutter_speed', e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Shutter (1/200s)"
                    />
                    <input
                      type="text"
                      value={featuredPhoto.camera_settings.iso}
                      onChange={(e) => handleCameraSettingChange('iso', e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ISO (400)"
                    />
                    <input
                      type="text"
                      value={featuredPhoto.camera_settings.lens}
                      onChange={(e) => handleCameraSettingChange('lens', e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      placeholder="Lens (85mm f/1.8)"
                    />
                    <input
                      type="text"
                      value={featuredPhoto.camera_settings.focal_length}
                      onChange={(e) => handleCameraSettingChange('focal_length', e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Focal Length (85mm)"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {featuredPhoto.image_url && (
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Preview</h3>
                    <img
                      src={featuredPhoto.image_url}
                      alt="Preview"
                      className="max-w-md h-64 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                      loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {loading ? 'Uploading...' : 'Add to Featured Photos'}
                  </button>
                </div>
              </form>
            )}

            {/* Gallery Photos Form */}
            {activeTab === 'gallery' && (
              <form onSubmit={handleGallerySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Photo Title *
                    </label>
                    <input
                      type="text"
                      value={galleryPhoto.title}
                      onChange={(e) => setGalleryPhoto({...galleryPhoto, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter photo title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={galleryPhoto.category}
                      onChange={(e) => setGalleryPhoto({...galleryPhoto, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    S3 Image URL *
                  </label>
                  <input
                    type="url"
                    value={galleryPhoto.image_url}
                    onChange={(e) => setGalleryPhoto({...galleryPhoto, image_url: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-bucket.s3.amazonaws.com/photo.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={galleryPhoto.description}
                    onChange={(e) => setGalleryPhoto({...galleryPhoto, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description..."
                  />
                </div>

                {/* Image Preview */}
                {galleryPhoto.image_url && (
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Preview</h3>
                    <img
                      src={galleryPhoto.image_url}
                      alt="Preview"
                      className="max-w-md h-64 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                      loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {loading ? 'Uploading...' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">💡 Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Featured Photos</h4>
              <ul className="space-y-1">
                <li>• Showcased on the main portfolio page</li>
                <li>• Include camera settings for technical details</li>
                <li>• Best for your highest quality work</li>
              </ul>
            </div>
            <div>
              <h4 className="text-green-400 font-medium mb-2">Gallery Photos</h4>
              <ul className="space-y-1">
                <li>• Displayed in the "More Photos" section</li>
                <li>• Organized by categories</li>
                <li>• Great for building a comprehensive collection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuickUpload;