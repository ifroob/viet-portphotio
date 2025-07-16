import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (article) {
      fetchRelatedArticles();
      updateMetaTags();
    }
  }, [article]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API}/articles/slug/${slug}`);
      setArticle(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      if (article.tags.length > 0) {
        const response = await axios.get(`${API}/articles?tag=${article.tags[0]}&limit=3`);
        const filtered = response.data.filter(a => a.id !== article.id);
        setRelatedArticles(filtered);
      }
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };

  const updateMetaTags = () => {
    // Update document title
    document.title = `${article.title} - Brian's Photography Blog`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', article.meta_description || article.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = article.meta_description || article.excerpt;
      document.head.appendChild(meta);
    }
    
    // Update Open Graph tags
    updateOrCreateMetaTag('property', 'og:title', article.title);
    updateOrCreateMetaTag('property', 'og:description', article.meta_description || article.excerpt);
    updateOrCreateMetaTag('property', 'og:type', 'article');
    updateOrCreateMetaTag('property', 'og:url', window.location.href);
    if (article.featured_image) {
      updateOrCreateMetaTag('property', 'og:image', article.featured_image);
    }
    
    // Update Twitter Card tags
    updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('name', 'twitter:title', article.title);
    updateOrCreateMetaTag('name', 'twitter:description', article.meta_description || article.excerpt);
    if (article.featured_image) {
      updateOrCreateMetaTag('name', 'twitter:image', article.featured_image);
    }
  };

  const updateOrCreateMetaTag = (attribute, value, content) => {
    let meta = document.querySelector(`meta[${attribute}="${value}"]`);
    if (meta) {
      meta.setAttribute('content', content);
    } else {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, value);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    // Convert markdown-like content to HTML
    return content
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mb-4 mt-8 text-blue-400">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/- (.*)/g, '<li class="mb-2">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link 
            to="/blog" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumb */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-400 hover:text-blue-300">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-blue-400 hover:text-blue-300">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-300">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-400 font-medium">
                {formatDate(article.publish_date)}
              </span>
              <span className="text-gray-400">
                {article.read_time} min read
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${formatContent(article.content)}</p>` }}
            />
          </div>

          {/* Author Info */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                alt="Brian"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Brian</h3>
                <p className="text-gray-400">Professional Photographer</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedArticles.map(article => (
                <div key={article.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                  {article.featured_image && (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white hover:text-blue-400 transition-colors">
                      <Link to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
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
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticleDetail;