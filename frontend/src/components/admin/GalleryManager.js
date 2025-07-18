import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GalleryManager = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, photo: null });

  useEffect(() => {
    loadPhotos();
    loadCategories();
  }, [selectedCategory]);

  const loadPhotos = async () => {
    try {
      let url = `${API}/gallery?limit=100`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const response = await axios.get(url);
      setPhotos(response.data);
    } catch (error) {
      console.error('Error loading gallery photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API}/gallery/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      await axios.delete(`${API}/gallery/${photoId}`);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      setDeleteModal({ show: false, photo: null });
      // Reload categories in case this was the last photo in a category
      loadCategories();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="text-xl">Loading gallery photos...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-400">Gallery Management</h2>
          <Link
            to="/admin/upload"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Quick Upload
          </Link>
        </div>

        {/* Category Filter */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Categories ({photos.length})
            </button>
            {categories.map(category => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.category.charAt(0).toUpperCase() + category.category.slice(1)} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {selectedCategory ? 'No photos found in this category.' : 'No gallery photos found.'}
            </p>
            <Link
              to="/admin/upload"
              className="text-green-400 hover:text-green-300 mt-2 inline-block"
            >
              Add your first gallery photo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {photo.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setDeleteModal({ show: true, photo })}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Delete Gallery Photo
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{deleteModal.photo?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, photo: null })}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePhoto(deleteModal.photo.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GalleryManager;