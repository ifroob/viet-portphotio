import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [article, setArticle] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    tags: [],
    is_published: false,
    featured_image: '',
    meta_description: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      loadArticle();
    }
  }, [id, isEditing]);

  const loadArticle = async () => {
    try {
      const response = await axios.get(`${API}/articles/${id}`);
      const articleData = response.data;
      setArticle(articleData);
      setTagInput(articleData.tags ? articleData.tags.join(', ') : '');
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Error loading article');
      navigate('/admin/blog');
    } finally {
      setInitialLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title)
    }));
  };

  const handleTagsChange = (value) => {
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setArticle(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API}/articles/${id}`, article);
      } else {
        await axios.post(`${API}/articles`, article);
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="text-xl">Loading article...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          {isEditing ? 'Edit Article' : 'New Article'}
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
                  value={article.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => setArticle({...article, slug: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /blog/{article.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle({...article, excerpt: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the article..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={article.featured_image}
                  onChange={(e) => setArticle({...article, featured_image: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="photography, tutorial, tips (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={article.meta_description}
                  onChange={(e) => setArticle({...article, meta_description: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SEO description for search engines..."
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Article Content * (Markdown supported)
              </label>
              <textarea
                value={article.content}
                onChange={(e) => setArticle({...article, content: e.target.value})}
                rows="20"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Write your article content here. You can use Markdown formatting..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use Markdown formatting: **bold**, *italic*, `code`, ## headers, [links](url), etc.
              </p>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Publishing Options</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={article.is_published}
                onChange={(e) => setArticle({...article, is_published: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_published" className="ml-2 text-sm text-gray-300">
                Publish this article immediately
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              If unchecked, the article will be saved as a draft
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
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
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Article' : 'Create Article')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BlogForm;