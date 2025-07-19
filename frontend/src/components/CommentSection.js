import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CommentSection = ({ photoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: "", comment: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (photoId) {
      fetchComments();
    }
  }, [photoId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API}/photos/${photoId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/photos/${photoId}/comments`, {
        photo_id: photoId,
        name: newComment.name,
        comment: newComment.comment
      });
      
      setComments([...comments, response.data]);
      setNewComment({ name: "", comment: "" });
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center">
              <span className="mr-3 text-5xl">💬</span>
              Comments & Feedback
            </h3>
            <p className="text-amber-700 mb-2 text-lg font-medium">
              Share your thoughts on this electrifying photograph
            </p>
            <p className="text-orange-600 text-sm italic">
              "Every great shot deserves great feedback"
            </p>
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-black/90 to-gray-900/90 p-8 rounded-lg mb-8 border-2 border-orange-500/50 shadow-xl">
            <div className="mb-6">
              <h4 className="text-orange-400 font-semibold mb-4 text-lg flex items-center">
                <span className="mr-2">✍️</span>
                Leave Your Mark
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Your name"
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-orange-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-orange-500/30 placeholder-amber-400 font-medium"
                required
              />
              <div className="md:flex md:items-center">
                <span className="text-amber-400 text-sm italic">
                  🎸 Rock on with your feedback!
                </span>
              </div>
            </div>
            <textarea
              placeholder="Share your thoughts about this electrifying photograph..."
              value={newComment.comment}
              onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
              className="w-full bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-orange-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6 border border-orange-500/30 placeholder-amber-400 font-medium"
              rows="4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50 transform hover:scale-105 shadow-lg border-2 border-orange-400 flex items-center"
            >
              <span className="mr-2">🚀</span>
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </form>

          {/* Comments Display */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-black/90 to-gray-900/90 rounded-lg border-2 border-orange-500/50 shadow-xl">
                <div className="mb-4 text-6xl">🎵</div>
                <p className="text-orange-400 text-2xl mb-3 font-bold">
                  No comments yet
                </p>
                <p className="text-amber-300 text-lg">
                  Be the first to share your electrifying thoughts
                </p>
                <div className="mt-4 text-amber-500 text-sm italic">
                  "Every masterpiece needs its first review"
                </div>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gradient-to-br from-black/90 to-gray-900/90 p-6 rounded-lg border-2 border-orange-500/30 hover:border-orange-400 transition-all shadow-lg transform hover:scale-102">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🎸</span>
                      <h4 className="font-bold text-orange-400 text-lg">{comment.name}</h4>
                    </div>
                    <span className="text-amber-500 text-sm font-medium bg-orange-900/30 px-3 py-1 rounded-full">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-orange-100 leading-relaxed font-medium pl-8">
                    "{comment.comment}"
                  </p>
                  <div className="mt-3 pl-8">
                    <div className="h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;