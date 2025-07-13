import React, { useState, useEffect } from "react";

const PhotoTweaker = () => {
  const [settings, setSettings] = useState({
    simulation: "Astia/Soft",
    grainEffect: "Off",
    colourChromeEffect: "Weak",
    colourChromeBlue: "Weak",
    whiteBalance: 7500,
    wbShiftRed: -4,
    wbShiftBlue: 4,
    dynamicRange: "DR400",
    highlights: -0.5,
    shadows: -1.5,
    color: 2,
    sharpness: 0,
    isoNoiseReduction: -4,
    clarity: -2,
    evCompensation: 0
  });

  const [previewStyle, setPreviewStyle] = useState({});

  const samplePhoto = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop";

  // Convert settings to CSS filters
  useEffect(() => {
    const style = {
      filter: `
        brightness(${1 + settings.evCompensation / 5})
        contrast(${1 + settings.color / 10})
        saturate(${1 + settings.color / 5})
        blur(${settings.sharpness < 0 ? Math.abs(settings.sharpness) : 0}px)
        sepia(${settings.simulation === "Sepia" ? 0.5 : 0})
      `,
      transform: `
        ${settings.highlights < 0 ? `brightness(${1 + settings.highlights / 10})` : ''}
        ${settings.shadows !== 0 ? `contrast(${1 + settings.shadows / 10})` : ''}
      `
    };
    setPreviewStyle(style);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      simulation: "Astia/Soft",
      grainEffect: "Off",
      colourChromeEffect: "Weak",
      colourChromeBlue: "Weak",
      whiteBalance: 7500,
      wbShiftRed: -4,
      wbShiftBlue: 4,
      dynamicRange: "DR400",
      highlights: -0.5,
      shadows: -1.5,
      color: 2,
      sharpness: 0,
      isoNoiseReduction: -4,
      clarity: -2,
      evCompensation: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          🎛️ Photo Recipe Tweaker
        </h1>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto text-lg">
          Time to get nerdy! 🤓 Adjust those Fujifilm settings in real-time and watch the magic happen. 
          Perfect for experimenting and learning what makes photos pop! ✨📸
        </p>

        {/* Photo Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Original</h3>
            <img 
              src={samplePhoto}
              alt="Original"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Modified</h3>
            <img 
              src={samplePhoto}
              alt="Modified"
              className="w-full h-64 object-cover rounded-lg transition-all duration-300"
              style={previewStyle}
            />
          </div>
        </div>

        {/* Settings Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Film Simulation */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Film Simulation</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Simulation</label>
                <select 
                  value={settings.simulation}
                  onChange={(e) => handleSettingChange('simulation', e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                >
                  <option value="Astia/Soft">Astia/Soft</option>
                  <option value="Velvia/Vivid">Velvia/Vivid</option>
                  <option value="Provia/Standard">Provia/Standard</option>
                  <option value="Classic Chrome">Classic Chrome</option>
                  <option value="Sepia">Sepia</option>
                </select>
                <p className="text-sm text-gray-400 mt-1">
                  Film simulation affects the overall color and tone rendering
                </p>
              </div>

              <div>
                <label className="block mb-2">Grain Effect</label>
                <select 
                  value={settings.grainEffect}
                  onChange={(e) => handleSettingChange('grainEffect', e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                >
                  <option value="Off">Off</option>
                  <option value="Weak">Weak</option>
                  <option value="Strong">Strong</option>
                </select>
                <p className="text-sm text-gray-400 mt-1">
                  Adds film-like grain texture to the image
                </p>
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Color Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Color: {settings.color}</label>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={settings.color}
                  onChange={(e) => handleSettingChange('color', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Controls color saturation and vibrancy
                </p>
              </div>

              <div>
                <label className="block mb-2">White Balance: {settings.whiteBalance}K</label>
                <input
                  type="range"
                  min="2500"
                  max="10000"
                  step="100"
                  value={settings.whiteBalance}
                  onChange={(e) => handleSettingChange('whiteBalance', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Adjusts color temperature (warm/cool)
                </p>
              </div>

              <div>
                <label className="block mb-2">Colour Chrome Effect</label>
                <select 
                  value={settings.colourChromeEffect}
                  onChange={(e) => handleSettingChange('colourChromeEffect', e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                >
                  <option value="Off">Off</option>
                  <option value="Weak">Weak</option>
                  <option value="Strong">Strong</option>
                </select>
                <p className="text-sm text-gray-400 mt-1">
                  Enhances color gradation in highlights
                </p>
              </div>
            </div>
          </div>

          {/* Tone Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Tone Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Highlights: {settings.highlights}</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.5"
                  value={settings.highlights}
                  onChange={(e) => handleSettingChange('highlights', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Adjusts brightness of highlight areas
                </p>
              </div>

              <div>
                <label className="block mb-2">Shadows: {settings.shadows}</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.5"
                  value={settings.shadows}
                  onChange={(e) => handleSettingChange('shadows', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Adjusts brightness of shadow areas
                </p>
              </div>

              <div>
                <label className="block mb-2">Dynamic Range</label>
                <select 
                  value={settings.dynamicRange}
                  onChange={(e) => handleSettingChange('dynamicRange', e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                >
                  <option value="DR100">DR100</option>
                  <option value="DR200">DR200</option>
                  <option value="DR400">DR400</option>
                </select>
                <p className="text-sm text-gray-400 mt-1">
                  Expands tonal range to preserve details
                </p>
              </div>

              <div>
                <label className="block mb-2">EV Compensation: {settings.evCompensation}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.3"
                  value={settings.evCompensation}
                  onChange={(e) => handleSettingChange('evCompensation', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Overall brightness adjustment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Detail Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Sharpness: {settings.sharpness}</label>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={settings.sharpness}
                  onChange={(e) => handleSettingChange('sharpness', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Controls edge enhancement and detail clarity
                </p>
              </div>

              <div>
                <label className="block mb-2">ISO Noise Reduction: {settings.isoNoiseReduction}</label>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={settings.isoNoiseReduction}
                  onChange={(e) => handleSettingChange('isoNoiseReduction', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Reduces digital noise at high ISO values
                </p>
              </div>

              <div>
                <label className="block mb-2">Clarity: {settings.clarity}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={settings.clarity}
                  onChange={(e) => handleSettingChange('clarity', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Enhances local contrast and texture
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Actions</h3>
            <div className="space-y-4">
              <button
                onClick={resetSettings}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition-colors"
              >
                Reset to Default
              </button>
              
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-semibold mb-2">Current Recipe</h4>
                <div className="text-sm space-y-1">
                  <div>Film Simulation: {settings.simulation}</div>
                  <div>White Balance: {settings.whiteBalance}K</div>
                  <div>Highlights: {settings.highlights}</div>
                  <div>Shadows: {settings.shadows}</div>
                  <div>Color: {settings.color}</div>
                  <div>Sharpness: {settings.sharpness}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoTweaker;