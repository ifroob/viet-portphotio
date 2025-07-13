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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8">Comments</h3>
        
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea
            placeholder="Share your thoughts about this photo..."
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            className="w-full bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows="4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {/* Comments Display */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Be the first to comment on this photo!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-blue-400">{comment.name}</h4>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;