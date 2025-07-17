import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PhotoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [photo, setPhoto] = useState({
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadPhoto();
    }
  }, [id, isEditing]);

  const loadPhoto = async () => {
    try {
      const response = await axios.get(`${API}/photos/${id}`);
      setPhoto(response.data);
    } catch (error) {
      console.error('Error loading photo:', error);
      alert('Error loading photo');
      navigate('/admin/photos');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API}/photos/${id}`, photo);
      } else {
        await axios.post(`${API}/photos`, photo);
      }
      navigate('/admin/photos');
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Error saving photo');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraSettingChange = (key, value) => {
    setPhoto(prev => ({
      ...prev,
      camera_settings: {
        ...prev.camera_settings,
        [key]: value
      }
    }));
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="text-xl">Loading photo...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          {isEditing ? 'Edit Photo' : 'Add New Photo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={photo.title}
                  onChange={(e) => setPhoto({...photo, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={photo.description}
                  onChange={(e) => setPhoto({...photo, description: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={photo.image_url}
                  onChange={(e) => setPhoto({...photo, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {/* Image Preview */}
              {photo.image_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <img
                    src={photo.image_url}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-md border border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Camera Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Camera Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Aperture
                </label>
                <input
                  type="text"
                  value={photo.camera_settings.aperture}
                  onChange={(e) => handleCameraSettingChange('aperture', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="f/2.8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Shutter Speed
                </label>
                <input
                  type="text"
                  value={photo.camera_settings.shutter_speed}
                  onChange={(e) => handleCameraSettingChange('shutter_speed', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1/200s"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ISO
                </label>
                <input
                  type="text"
                  value={photo.camera_settings.iso}
                  onChange={(e) => handleCameraSettingChange('iso', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ISO 400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lens
                </label>
                <input
                  type="text"
                  value={photo.camera_settings.lens}
                  onChange={(e) => handleCameraSettingChange('lens', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="85mm f/1.8"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Focal Length
                </label>
                <input
                  type="text"
                  value={photo.camera_settings.focal_length}
                  onChange={(e) => handleCameraSettingChange('focal_length', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="85mm"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/photos')}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md transition-colors ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Photo' : 'Add Photo')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PhotoForm;