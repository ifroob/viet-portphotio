import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    photos: 0,
    gallery: 0,
    articles: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [photosRes, galleryRes, articlesRes] = await Promise.all([
        axios.get(`${API}/photos`),
        axios.get(`${API}/gallery`),
        axios.get(`${API}/articles`)
      ]);

      setStats({
        photos: photosRes.data.length,
        gallery: galleryRes.data.length,
        articles: articlesRes.data.length,
        comments: 0 // We'll implement comment counting later
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black/95 to-gray-900/95 shadow-xl border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent flex items-center">
              <span className="mr-3 text-4xl">🎸</span>
              Viet's Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-orange-300 hover:text-orange-100 transition-colors font-medium"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-6 border-2 border-orange-500/50 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-200">Featured Photos</p>
                <p className="text-2xl font-bold text-orange-400">
                  {loading ? '...' : stats.photos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-6 border-2 border-amber-500/50 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-200">Gallery Photos</p>
                <p className="text-2xl font-bold text-amber-400">
                  {loading ? '...' : stats.gallery}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-6 border-2 border-orange-400/50 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-200">Blog Articles</p>
                <p className="text-2xl font-bold text-orange-300">
                  {loading ? '...' : stats.articles}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-6 border-2 border-amber-400/50 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-200">Comments</p>
                <p className="text-2xl font-bold text-amber-400">
                  {loading ? '...' : stats.comments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Enhanced Upload Card - Featured */}
          <div className="bg-gradient-to-br from-orange-600/90 to-amber-600/90 rounded-lg p-6 border-2 border-orange-400/50 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <span className="mr-2 text-2xl">🚀</span>
              Enhanced Upload
            </h3>
            <p className="text-orange-100 mb-4">
              Advanced drag & drop interface with batch editing, storage upload, and metadata management.
            </p>
            <div className="flex space-x-2">
              <Link
                to="/admin/enhanced-upload"
                className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md transition-all font-medium flex-1 text-center transform hover:scale-105 shadow-lg"
              >
                Start Upload
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-6 border-2 border-orange-500/50 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-orange-300 flex items-center">
              <span className="mr-2 text-xl">📸</span>
              Photo Management
            </h3>
            <p className="text-orange-200 mb-4">
              Upload new photos, edit existing ones, and manage your portfolio gallery.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/photos/new"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3 py-2 rounded-md transition-all text-sm transform hover:scale-105"
              >
                Add Featured
              </Link>
              <Link
                to="/admin/photos"
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-3 py-2 rounded-md transition-all text-sm transform hover:scale-105"
              >
                Manage Featured
              </Link>
              <Link
                to="/admin/gallery"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 rounded-md transition-all text-sm transform hover:scale-105"
              >
                Manage Gallery
              </Link>
              <Link
                to="/admin/upload"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-2 rounded-md transition-all text-sm transform hover:scale-105"
              >
                Quick Upload
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg p-6 border-2 border-amber-500/50 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-amber-300 flex items-center">
              <span className="mr-2 text-xl">✍️</span>
              Blog Management
            </h3>
            <p className="text-amber-200 mb-4">
              Write new articles, edit existing posts, and manage your blog content.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/admin/blog/new"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 shadow-lg"
              >
                New Article
              </Link>
              <Link
                to="/admin/blog"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 shadow-lg"
              >
                Manage Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;