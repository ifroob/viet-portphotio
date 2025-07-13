import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import PhotoTweaker from "./components/PhotoTweaker";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-black text-white p-4 shadow-lg border-b border-blue-500/30">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Brian's Portphotio
        </Link>
        <div className="space-x-6">
          <Link 
            to="/" 
            className={`font-medium transition-colors px-3 py-2 rounded ${
              location.pathname === '/' 
                ? 'text-blue-400 bg-blue-500/20 border border-blue-500/50' 
                : 'hover:text-blue-400'
            }`}
          >
            Portfolio
          </Link>
          <Link 
            to="/tweaker" 
            className={`font-medium transition-colors px-3 py-2 rounded ${
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
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/tweaker" element={<PhotoTweaker />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;