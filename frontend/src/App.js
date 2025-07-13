import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import PhotoTweaker from "./components/PhotoTweaker";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="bg-black text-white p-4 shadow-lg border-b border-blue-500/30">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Brian's Portfolio
            </Link>
            <div className="space-x-6">
              <Link to="/" className="hover:text-blue-400 transition-colors font-medium">Portfolio</Link>
              <Link to="/tweaker" className="hover:text-blue-400 transition-colors font-medium">Recipe Tweaker</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/tweaker" element={<PhotoTweaker />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;