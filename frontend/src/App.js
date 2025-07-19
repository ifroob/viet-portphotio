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
    <nav className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 p-4 shadow-lg border-b-2 border-amber-200">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link 
          to="/" 
          className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent tracking-wide"
          style={{ fontFamily: 'serif' }}
        >
          Viet's Portfolio
        </Link>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-base">
          <Link 
            to="/" 
            className={`text-sm sm:text-base transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded ${
              location.pathname === '/' 
                ? 'text-amber-800 bg-amber-200 border border-amber-300' 
                : 'hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            Portfolio
          </Link>
          <Link 
            to="/photos" 
            className={`text-sm sm:text-base transition-colors px-2 py-1 sm:px-3 sm:py-2 rounded ${
              location.pathname === '/photos' 
                ? 'text-amber-800 bg-amber-200 border border-amber-300' 
                : 'hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            More Photos
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