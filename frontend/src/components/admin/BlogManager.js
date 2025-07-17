import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BlogManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, article: null });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await axios.get(`${API}/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      await axios.delete(`${API}/articles/${articleId}`);
      setArticles(articles.filter(article => article.id !== articleId));
      setDeleteModal({ show: false, article: null });
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  const togglePublish = async (articleId, isPublished) => {
    try {
      await axios.put(`${API}/articles/${articleId}`, { is_published: !isPublished });
      setArticles(articles.map(article => 
        article.id === articleId 
          ? { ...article, is_published: !isPublished }
          : article
      ));
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Error updating article');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="text-xl">Loading articles...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-400">Blog Management</h2>
          <Link
            to="/admin/blog/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            New Article
          </Link>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found.</p>
            <Link
              to="/admin/blog/new"
              className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
            >
              Write your first article
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.is_published 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      {article.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Slug: {article.slug}</span>
                      <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                      {article.tags && article.tags.length > 0 && (
                        <span>Tags: {article.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  {article.featured_image && (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-md ml-4"
                    />
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Link
                      to={`/admin/blog/edit/${article.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => togglePublish(article.id, article.is_published)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm"
                    >
                      {article.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, article })}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  {article.is_published && (
                    <Link
                      to={`/blog/${article.slug}`}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      View →
                    </Link>
                  )}
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
                Delete Article
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{deleteModal.article?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, article: null })}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteArticle(deleteModal.article.id)}
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

export default BlogManager;