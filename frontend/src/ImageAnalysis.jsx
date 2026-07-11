import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { getPlants } from './utils';

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const data = await getPlants();
        if (data.success) setPlants(data.plants);
      } catch (err) {
        console.error('Failed to load plants:', err);
      }
    };
    loadPlants();
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setSelectedImage(file);
    setError(null);
    setResults(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }
    try {
      setAnalyzing(true);
      setError(null);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        
        // Ensure token is passed if logged in
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch('/api/image-analyze', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ image: base64, plant_id: selectedPlantId || null })
        });
        const data = await response.json();
        if (data.success) {
          setResults(data.analysis);
        } else {
          setError(data.error || 'Analysis failed');
        }
        setAnalyzing(false);
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      setError('Analysis failed: ' + err.message);
      setAnalyzing(false);
    }
  };

  const getHealthColor = (status) => {
    if (status === 'Critical') return 'text-red-600 bg-red-100';
    if (status === 'Moderate Concern') return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Image Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of your plant and our AI will analyze it for signs of disease.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <div>
            <Card className="shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Upload Plant Image</CardTitle>
                <CardDescription>Drag & drop or click to select an image</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('imageInput').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected plant" className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <div>
                      <div className="text-5xl mb-4">📷</div>
                      <p className="text-gray-600 mb-2">Drag & drop your plant image here</p>
                      <p className="text-gray-400 text-sm">or click to browse files</p>
                    </div>
                  )}
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {results && results.mismatch_warning && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0 text-xl">⚠️</div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-medium">{results.mismatch_warning}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Plant Selection (Optional) */}
            <Card className="shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Select Plant (Optional)</CardTitle>
                <CardDescription>Narrow down results by specifying the plant type</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedPlantId}
                  onChange={(e) => setSelectedPlantId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Auto-detect (all plants)</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>{plant.name} - {plant.category_label}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                ⚠️ {error}
              </div>
            )}

            <div className="text-center space-x-4">
              <Button onClick={() => navigate('/')} variant="outline">← Back to Home</Button>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || analyzing}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Analyzing...
                  </>
                ) : (
                  '🔬 Analyze Image'
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {analyzing && (
              <Card className="shadow-md">
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg mb-2">AI Analysis in Progress...</p>
                  <p className="text-gray-400 text-sm">Processing image patterns and matching against disease database</p>
                </CardContent>
              </Card>
            )}

            {results && !analyzing && (
              <>
                {/* Health Assessment */}
                <Card className="shadow-md mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">Health Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getHealthColor(results.health_status)}`}>
                        {results.health_status}
                      </span>
                      <span className="text-gray-600">Confidence: {results.overall_confidence}%</span>
                    </div>
                    <Progress value={results.overall_confidence} className="h-2" />
                  </CardContent>
                </Card>

                {/* Visual Findings */}
                <Card className="shadow-md mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">Visual Findings</CardTitle>
                    <CardDescription>Patterns detected in the image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.visual_findings.map((finding, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-800">{finding.description}</span>
                            <span className="text-sm text-green-600 font-medium">{Math.round(finding.confidence * 100)}%</span>
                          </div>
                          <Progress value={finding.confidence * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Disease Matches */}
                {results.disease_matches.length > 0 && (
                  <Card className="shadow-md mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-800">Possible Diseases</CardTitle>
                      <CardDescription>Ranked by visual pattern matching</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.disease_matches.map((match, idx) => (
                          <div key={idx} className="border-2 rounded-lg p-4 hover:border-green-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-800">{match.disease.name}</h4>
                                <p className="text-sm text-gray-600">{match.disease.plant_name} • {match.disease.pathogen_type}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                match.confidence >= 70 ? 'text-green-600 bg-green-100' :
                                match.confidence >= 40 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100'
                              }`}>
                                {Math.round(match.confidence)}%
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{match.disease.description?.substring(0, 120)}...</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                <Card className="shadow-md bg-blue-50 border-blue-200">
                  <CardContent className="py-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Recommendations</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      {results.recommendations.map((rec, idx) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {!results && !analyzing && (
              <Card className="shadow-md">
                <CardContent className="py-12 text-center">
                  <div className="text-5xl mb-4">🌿</div>
                  <p className="text-gray-600 text-lg mb-2">Upload an image to get started</p>
                  <p className="text-gray-400 text-sm">Our AI will analyze the image for disease patterns</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
