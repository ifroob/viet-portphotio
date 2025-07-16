import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, [searchTerm, selectedTag]);

  const fetchArticles = async () => {
    try {
      let url = `${API}/articles?limit=10`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }
      
      const response = await axios.get(url);
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API}/articles/tags/all`);
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
            Photography Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Insights, tutorials, and stories from behind the lens. 
            Explore the art and craft of photography through my experiences and discoveries.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.tag} value={tag.tag}>
                  {tag.tag} ({tag.count})
                </option>
              ))}
            </select>
          </div>
          {(searchTerm || selectedTag) && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <article key={article.id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              {article.featured_image && (
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-400">
                    {formatDate(article.publish_date)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {article.read_time} min read
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-3 text-white hover:text-blue-400 transition-colors">
                  <Link to={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm cursor-pointer hover:bg-blue-500/30 transition-colors"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchTerm || selectedTag ? 'No articles found matching your search.' : 'No articles available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;