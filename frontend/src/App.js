import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import PhotoTweaker from "./components/PhotoTweaker";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="bg-black text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">Brian's Portfolio</Link>
            <div className="space-x-6">
              <Link to="/" className="hover:text-gray-300 transition-colors">Portfolio</Link>
              <Link to="/tweaker" className="hover:text-gray-300 transition-colors">Photo Recipe Tweaker</Link>
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