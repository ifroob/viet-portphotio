import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Portfolio from "./components/Portfolio";
import PhotoTweaker from "./components/PhotoTweaker";
import Blog from "./components/Blog";
import ArticleDetail from "./components/ArticleDetail";
import MorePhotos from "./components/MorePhotos";

// Admin Components
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import PhotoManager from "./components/admin/PhotoManager";
import PhotoForm from "./components/admin/PhotoForm";
import BlogManager from "./components/admin/BlogManager";
import BlogForm from "./components/admin/BlogForm";
import QuickUpload from "./components/admin/QuickUpload";
import EnhancedUpload from "./components/admin/EnhancedUpload";
import GalleryManager from "./components/admin/GalleryManager";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-black text-white p-4 shadow-lg border-b border-blue-500/30">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link 
          to="/" 
          className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic"
          style={{ fontFamily: 'cursive' }}
        >
          Brian's PortPhotio
        </Link>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-base">
          <Link 
            to="/" 
            className={`text-sm sm:text-base transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded ${
              location.pathname === '/' 
                ? 'text-blue-400 bg-blue-500/20 border border-blue-500/50' 
                : 'hover:text-blue-400'
            }`}
          >
            Portfolio
          </Link>
          <Link 
            to="/blog" 
            className={`text-sm sm:text-base transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded ${
              location.pathname.startsWith('/blog') 
                ? 'text-blue-400 bg-blue-500/20 border border-blue-500/50' 
                : 'hover:text-blue-400'
            }`}
          >
            Blog
          </Link>
          <Link 
            to="/photos" 
            className={`text-sm sm:text-base transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded ${
              location.pathname === '/photos' 
                ? 'text-blue-400 bg-blue-500/20 border border-blue-500/50' 
                : 'hover:text-blue-400'
            }`}
          >
            More Photos
          </Link>
          <Link 
            to="/tweaker" 
            className={`text-sm sm:text-base transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded ${
              location.pathname === '/tweaker' 
                ? 'text-blue-400 bg-blue-500/20 border border-blue-500/50' 
                : 'hover:text-blue-400'
            }`}
          >
            Recipe Tweaker
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navigation /><Portfolio /></>} />
            <Route path="/blog" element={<><Navigation /><Blog /></>} />
            <Route path="/blog/:slug" element={<><Navigation /><ArticleDetail /></>} />
            <Route path="/photos" element={<><Navigation /><MorePhotos /></>} />
            <Route path="/tweaker" element={<><Navigation /><PhotoTweaker /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/photos" element={
              <ProtectedRoute>
                <PhotoManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/photos/new" element={
              <ProtectedRoute>
                <PhotoForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/photos/edit/:id" element={
              <ProtectedRoute>
                <PhotoForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute>
                <BlogManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/new" element={
              <ProtectedRoute>
                <BlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/edit/:id" element={
              <ProtectedRoute>
                <BlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload" element={
              <ProtectedRoute>
                <QuickUpload />
              </ProtectedRoute>
            } />
            <Route path="/admin/enhanced-upload" element={
              <ProtectedRoute>
                <EnhancedUpload />
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute>
                <GalleryManager />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;