import React, { useState, useRef, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EnhancedUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadType, setUploadType] = useState('featured'); // featured or gallery
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [globalSettings, setGlobalSettings] = useState({
    category: 'general',
    defaultDescription: '',
    batchCameraSettings: {
      aperture: '',
      shutter_speed: '',
      iso: '',
      lens: '',
      focal_length: ''
    }
  });
  
  const fileInputRef = useRef(null);

  const categories = [
    'general', 'portrait', 'landscape', 'street', 'architecture', 
    'macro', 'wedding', 'urban', 'abstract', 'nature'
  ];

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Handle file selection
  const handleFiles = (files) => {
    const fileList = Array.from(files);
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
    
    const newFiles = imageFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      uploading: false,
      storageUrl: '',
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: globalSettings.defaultDescription,
        category: uploadType === 'gallery' ? globalSettings.category : undefined,
        camera_settings: uploadType === 'featured' ? { ...globalSettings.batchCameraSettings } : undefined
      },
      error: null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Update individual file metadata
  const updateFileMetadata = (fileId, field, value) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            metadata: { 
              ...file.metadata, 
              [field]: value 
            } 
          }
        : file
    ));
  };

  // Update camera settings for featured photos
  const updateCameraSettings = (fileId, setting, value) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            metadata: { 
              ...file.metadata, 
              camera_settings: {
                ...file.metadata.camera_settings,
                [setting]: value
              }
            } 
          }
        : file
    ));
  };

  // Apply global settings to all files
  const applyGlobalSettings = () => {
    setUploadedFiles(prev => prev.map(file => ({
      ...file,
      metadata: {
        ...file.metadata,
        description: file.metadata.description || globalSettings.defaultDescription,
        category: uploadType === 'gallery' ? globalSettings.category : file.metadata.category,
        camera_settings: uploadType === 'featured' ? { ...globalSettings.batchCameraSettings } : file.metadata.camera_settings
      }
    })));
  };

  // Simulate S3 upload (replace with actual S3 integration)
  const uploadToStorage = async (file, fileId) => {
    return new Promise((resolve, reject) => {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        setUploadProgress(prev => ({ ...prev, [fileId]: Math.min(progress, 95) }));
        
        if (progress >= 100) {
          clearInterval(interval);
          // Simulate successful upload with a mock S3 URL
          const mockS3Url = `https://your-bucket.s3.amazonaws.com/photos/${Date.now()}-${file.name}`;
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          resolve(mockS3Url);
        }
      }, 200);
      
      // Simulate potential failure (5% chance)
      setTimeout(() => {
        if (Math.random() < 0.05) {
          clearInterval(interval);
          reject(new Error('Upload failed'));
        }
      }, 1000);
    });
  };

  // Upload individual file
  const uploadFile = async (fileData) => {
    try {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, uploading: true, error: null } : f
      ));

      // Upload to storage service
      const storageUrl = await uploadToStorage(fileData.file, fileData.id);
      
      // Update file with storage URL
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, storageUrl, uploading: false, uploaded: true }
          : f
      ));

    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, uploading: false, error: error.message }
          : f
      ));
    }
  };

  // Upload all files to storage
  const uploadAllToStorage = async () => {
    setUploading(true);
    const unuploadedFiles = uploadedFiles.filter(f => !f.uploaded && !f.uploading);
    
    try {
      await Promise.all(unuploadedFiles.map(uploadFile));
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    
    setUploading(false);
  };

  // Submit photos to database
  const submitPhotos = async () => {
    const readyFiles = uploadedFiles.filter(f => f.uploaded && f.storageUrl);
    
    if (readyFiles.length === 0) {
      alert('No photos ready for submission. Please upload files first.');
      return;
    }

    setUploading(true);
    
    try {
      const endpoint = uploadType === 'featured' ? '/photos' : '/gallery';
      
      const submissions = readyFiles.map(file => {
        const payload = {
          title: file.metadata.title,
          description: file.metadata.description,
          image_url: file.storageUrl
        };

        if (uploadType === 'featured') {
          payload.camera_settings = file.metadata.camera_settings;
        } else {
          payload.category = file.metadata.category;
        }

        return axios.post(`${API}${endpoint}`, payload);
      });

      await Promise.all(submissions);
      
      // Clear uploaded files
      setUploadedFiles([]);
      setUploadProgress({});
      alert(`Successfully submitted ${readyFiles.length} photos to ${uploadType} section!`);
      
    } catch (error) {
      console.error('Error submitting photos:', error);
      alert('Error submitting some photos. Please try again.');
    }
    
    setUploading(false);
  };

  // Remove file
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-400">Enhanced Photo Upload</h2>
            <p className="text-gray-400 mt-2">Drag & drop multiple photos, upload to storage, and edit metadata</p>
          </div>
          
          {/* Upload Type Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setUploadType('featured')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadType === 'featured'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              ⭐ Featured Photos
            </button>
            <button
              onClick={() => setUploadType('gallery')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadType === 'gallery'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🖼️ Gallery Photos
            </button>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Batch Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Description
              </label>
              <input
                type="text"
                value={globalSettings.defaultDescription}
                onChange={(e) => setGlobalSettings(prev => ({ ...prev, defaultDescription: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description for all photos"
              />
            </div>
            
            {uploadType === 'gallery' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Category
                </label>
                <select
                  value={globalSettings.category}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex items-end">
              <button
                onClick={applyGlobalSettings}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                Apply to All
              </button>
            </div>
          </div>

          {/* Batch Camera Settings for Featured Photos */}
          {uploadType === 'featured' && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-md font-medium text-gray-200 mb-3">Batch Camera Settings</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <input
                  type="text"
                  placeholder="Aperture"
                  value={globalSettings.batchCameraSettings.aperture}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    batchCameraSettings: { ...prev.batchCameraSettings, aperture: e.target.value }
                  }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Shutter Speed"
                  value={globalSettings.batchCameraSettings.shutter_speed}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    batchCameraSettings: { ...prev.batchCameraSettings, shutter_speed: e.target.value }
                  }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="ISO"
                  value={globalSettings.batchCameraSettings.iso}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    batchCameraSettings: { ...prev.batchCameraSettings, iso: e.target.value }
                  }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Lens"
                  value={globalSettings.batchCameraSettings.lens}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    batchCameraSettings: { ...prev.batchCameraSettings, lens: e.target.value }
                  }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Focal Length"
                  value={globalSettings.batchCameraSettings.focal_length}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    batchCameraSettings: { ...prev.batchCameraSettings, focal_length: e.target.value }
                  }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drag & Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-400/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="text-6xl text-gray-500">📸</div>
            <div>
              <p className="text-xl text-gray-300">Drag & drop your photos here</p>
              <p className="text-gray-500 mt-2">or click to browse files</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Select Photos
            </button>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-200">
                {uploadedFiles.length} Photo{uploadedFiles.length !== 1 ? 's' : ''} Ready
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={uploadAllToStorage}
                  disabled={uploading || uploadedFiles.every(f => f.uploaded)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    uploading || uploadedFiles.every(f => f.uploaded)
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white`}
                >
                  {uploading ? 'Uploading to Storage...' : 'Upload to Storage'}
                </button>
                <button
                  onClick={submitPhotos}
                  disabled={uploading || !uploadedFiles.some(f => f.uploaded)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    uploading || !uploadedFiles.some(f => f.uploaded)
                      ? 'bg-gray-600 cursor-not-allowed'
                      : uploadType === 'featured'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  Submit to {uploadType === 'featured' ? 'Featured' : 'Gallery'}
                </button>
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-900">
                    <img
                      src={file.preview}
                      alt={file.metadata.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Overlay */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {file.uploaded && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Uploaded
                        </span>
                      )}
                      {file.uploading && (
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                          Uploading...
                        </span>
                      )}
                      {file.error && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          Error
                        </span>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {file.uploading && uploadProgress[file.id] && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/75 p-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          ></div>
                        </div>
                        <p className="text-white text-xs mt-1">{Math.round(uploadProgress[file.id])}%</p>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  {/* Metadata Form */}
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={file.metadata.title}
                      onChange={(e) => updateFileMetadata(file.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Photo title"
                    />
                    
                    <textarea
                      value={file.metadata.description}
                      onChange={(e) => updateFileMetadata(file.id, 'description', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description"
                    />

                    {uploadType === 'gallery' && (
                      <select
                        value={file.metadata.category}
                        onChange={(e) => updateFileMetadata(file.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}

                    {uploadType === 'featured' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={file.metadata.camera_settings.aperture}
                            onChange={(e) => updateCameraSettings(file.id, 'aperture', e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="f/2.8"
                          />
                          <input
                            type="text"
                            value={file.metadata.camera_settings.shutter_speed}
                            onChange={(e) => updateCameraSettings(file.id, 'shutter_speed', e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="1/200s"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={file.metadata.camera_settings.iso}
                            onChange={(e) => updateCameraSettings(file.id, 'iso', e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="ISO 400"
                          />
                          <input
                            type="text"
                            value={file.metadata.camera_settings.lens}
                            onChange={(e) => updateCameraSettings(file.id, 'lens', e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="85mm f/1.8"
                          />
                          <input
                            type="text"
                            value={file.metadata.camera_settings.focal_length}
                            onChange={(e) => updateCameraSettings(file.id, 'focal_length', e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="85mm"
                          />
                        </div>
                      </div>
                    )}

                    {file.error && (
                      <p className="text-red-400 text-sm">{file.error}</p>
                    )}

                    {file.storageUrl && (
                      <p className="text-green-400 text-xs break-all">
                        Storage: {file.storageUrl}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">📋 How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Upload Process</h4>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Select upload type (Featured or Gallery)</li>
                <li>Set batch settings for common fields</li>
                <li>Drag & drop or select multiple photos</li>
                <li>Edit individual photo metadata</li>
                <li>Upload photos to storage service</li>
                <li>Submit to your portfolio</li>
              </ol>
            </div>
            <div>
              <h4 className="text-green-400 font-medium mb-2">Pro Tips</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use batch settings to save time on common fields</li>
                <li>File names become default titles</li>
                <li>You can upload to storage and edit metadata simultaneously</li>
                <li>Remove unwanted photos before uploading</li>
                <li>Check upload progress in the overlay</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EnhancedUpload;