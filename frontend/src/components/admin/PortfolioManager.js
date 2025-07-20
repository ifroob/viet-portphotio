import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PortfolioManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    category: 'general'
  });

  // Avatar options (you can add more URLs here)
  const avatarOptions = [
    "https://images.unsplash.com/photo-1520166012956-add9ba0835cb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxlbGVjdHJpYyUyMGd1aXRhcnxlbnwwfHx8fDE3NTI5NjAxMzl8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc1Mjk2MDE0MHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtdXNpY2lhbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc1Mjk2MDE0MHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxtdXNpY2lhbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc1Mjk2MDE0MHww&ixlib=rb-4.1.0&q=85"
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/portfolio-settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading portfolio settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await axios.put(`${API}/portfolio-settings`, settings);
      setSettings(response.data);
      setMessage('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarSelect = (index) => {
    const updatedAvatars = [...avatarOptions];
    setSettings(prev => ({
      ...prev,
      avatar_urls: updatedAvatars,
      selected_avatar_index: index
    }));
  };

  const addEquipment = async () => {
    if (!newEquipment.name.trim() || !newEquipment.description.trim()) {
      setMessage('Please fill in equipment name and description');
      return;
    }

    try {
      const response = await axios.post(`${API}/portfolio-settings/equipment`, newEquipment);
      setSettings(response.data);
      setNewEquipment({ name: '', description: '', category: 'general' });
      setMessage('Equipment added successfully!');
    } catch (error) {
      console.error('Error adding equipment:', error);
      setMessage('Error adding equipment');
    }
  };

  const deleteEquipment = async (itemId) => {
    try {
      await axios.delete(`${API}/portfolio-settings/equipment/${itemId}`);
      setSettings(prev => ({
        ...prev,
        equipment_items: prev.equipment_items.filter(item => item.id !== itemId)
      }));
      setMessage('Equipment deleted successfully!');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      setMessage('Error deleting equipment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-800 text-xl">Loading portfolio settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black/95 to-gray-900/95 shadow-xl border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent flex items-center">
              <span className="mr-3 text-4xl">🎸</span>
              Portfolio Settings
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="text-orange-300 hover:text-orange-100 transition-colors font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Avatar Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Avatar Selection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avatarOptions.map((avatarUrl, index) => (
              <div
                key={index}
                onClick={() => handleAvatarSelect(index)}
                className={`cursor-pointer border-4 rounded-lg p-2 transition-all transform hover:scale-105 ${
                  settings?.selected_avatar_index === index 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={`Avatar option ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {settings?.selected_avatar_index === index && (
                  <div className="text-center mt-2 text-orange-600 font-semibold">Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Text Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">✏️</span>
            Main Text Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
              <input
                type="text"
                value={settings?.main_title || ''}
                onChange={(e) => handleInputChange('main_title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Viet's PortPhotio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Subtitle</label>
              <input
                type="text"
                value={settings?.main_subtitle || ''}
                onChange={(e) => handleInputChange('main_subtitle', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Hi I'm Viet, welcome."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Quote</label>
              <input
                type="text"
                value={settings?.main_quote || ''}
                onChange={(e) => handleInputChange('main_quote', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Photography is the rhythm that makes memories rock."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Section Title</label>
              <input
                type="text"
                value={settings?.equipment_title || ''}
                onChange={(e) => handleInputChange('equipment_title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Electric Guitar Rig"
              />
            </div>
          </div>
        </div>

        {/* Equipment Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">🎸</span>
            Equipment Management
          </h2>
          
          {/* Add New Equipment */}
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Add New Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Equipment name"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Description/Model"
                value={newEquipment.description}
                onChange={(e) => setNewEquipment(prev => ({ ...prev, description: e.target.value }))}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                onClick={addEquipment}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-3 rounded-md transition-all transform hover:scale-105"
              >
                Add Equipment
              </button>
            </div>
          </div>

          {/* Equipment List */}
          <div className="space-y-4">
            {settings?.equipment_items?.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
                    {item.category}
                  </span>
                </div>
                <button
                  onClick={() => deleteEquipment(item.id)}
                  className="text-red-600 hover:text-red-800 font-semibold ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
            {(!settings?.equipment_items || settings.equipment_items.length === 0) && (
              <p className="text-gray-500 text-center py-8">No equipment items added yet.</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">📞</span>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings?.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings?.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 rounded-md transition-all transform hover:scale-105 disabled:opacity-50 text-lg font-semibold"
          >
            {saving ? 'Saving...' : 'Save Portfolio Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManager;