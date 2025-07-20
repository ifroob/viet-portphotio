import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SEOManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/seo-settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await axios.put(`${API}/seo-settings`, settings);
      setSettings(response.data);
      setMessage('SEO settings saved successfully!');
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

  const handleSocialMediaChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [field]: value
      }
    }));
  };

  const handleKeywordsChange = (value) => {
    const keywords = value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword);
    setSettings(prev => ({
      ...prev,
      site_keywords: keywords
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-800 text-xl">Loading SEO settings...</div>
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
              <span className="mr-3 text-4xl">🔍</span>
              SEO Settings
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

        {/* Basic SEO Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">🌐</span>
            Basic SEO Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
              <input
                type="text"
                value={settings?.site_title || ''}
                onChange={(e) => handleInputChange('site_title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Your Site Title"
              />
              <p className="text-sm text-gray-500 mt-1">This appears in browser tabs and search results</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea
                value={settings?.site_description || ''}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief description of your portfolio and services"
              />
              <p className="text-sm text-gray-500 mt-1">Keep it under 160 characters for best results</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                value={settings?.site_keywords?.join(', ') || ''}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="photography, portrait, music, rock, professional"
              />
              <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
            </div>
          </div>
        </div>

        {/* Open Graph (Facebook/Instagram) Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">📘</span>
            Facebook & Instagram Sharing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph Title</label>
              <input
                type="text"
                value={settings?.og_title || ''}
                onChange={(e) => handleInputChange('og_title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Title when shared on Facebook/Instagram"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph Description</label>
              <textarea
                value={settings?.og_description || ''}
                onChange={(e) => handleInputChange('og_description', e.target.value)}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Description when shared on Facebook/Instagram"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph Image URL</label>
              <input
                type="url"
                value={settings?.og_image || ''}
                onChange={(e) => handleInputChange('og_image', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630 pixels</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
              <input
                type="url"
                value={settings?.og_url || ''}
                onChange={(e) => handleInputChange('og_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
        </div>

        {/* Twitter Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">🐦</span>
            Twitter/X Sharing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card Type</label>
              <select
                value={settings?.twitter_card_type || 'summary_large_image'}
                onChange={(e) => handleInputChange('twitter_card_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Title</label>
              <input
                type="text"
                value={settings?.twitter_title || ''}
                onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Title when shared on Twitter/X"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Description</label>
              <textarea
                value={settings?.twitter_description || ''}
                onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Description when shared on Twitter/X"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image URL</label>
              <input
                type="url"
                value={settings?.twitter_image || ''}
                onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x600 pixels</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">🔗</span>
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings?.social_media?.facebook_url || ''}
                onChange={(e) => handleSocialMediaChange('facebook_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings?.social_media?.instagram_url || ''}
                onChange={(e) => handleSocialMediaChange('instagram_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://instagram.com/yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="url"
                value={settings?.social_media?.youtube_url || ''}
                onChange={(e) => handleSocialMediaChange('youtube_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://youtube.com/channel/yourchannel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X URL</label>
              <input
                type="url"
                value={settings?.social_media?.twitter_url || ''}
                onChange={(e) => handleSocialMediaChange('twitter_url', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://twitter.com/yourusername"
              />
            </div>
          </div>
        </div>

        {/* SEO Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
            <span className="mr-2">👁️</span>
            SEO Preview
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-blue-600 text-lg font-medium mb-1">
              {settings?.og_title || settings?.site_title || 'Your Site Title'}
            </div>
            <div className="text-green-700 text-sm mb-1">
              {settings?.og_url || 'https://yoursite.com'}
            </div>
            <div className="text-gray-600 text-sm">
              {settings?.og_description || settings?.site_description || 'Your site description...'}
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
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOManager;