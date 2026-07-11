import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diagnoseDisease } from './utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';

const SymptomChecker = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load selected plant from localStorage
    const plant = localStorage.getItem('selectedPlant');
    if (plant) {
      setSelectedPlant(JSON.parse(plant));
    } else {
      navigate('/plant-selection');
    }
  }, [navigate]);

  const symptomCategories = [
    {
      id: 'leaf',
      title: 'Leaf Symptoms',
      symptoms: [
        'Brown spots on leaves',
        'Yellow spots on leaves',
        'White spots on leaves',
        'Holes in leaves',
        'Leaf curling',
        'Leaf wilting',
        'Leaf yellowing',
        'Leaf dropping',
        'Spots with rings',
        'Fuzzy growth on leaves'
      ]
    },
    {
      id: 'stem',
      title: 'Stem Symptoms',
      symptoms: [
        'Brown lesions on stem',
        'Stem rot',
        'Stem wilting',
        'Stem discoloration',
        'Stem cankers',
        'Stem breakage'
      ]
    },
    {
      id: 'fruit',
      title: 'Fruit Symptoms',
      symptoms: [
        'Spots on fruit',
        'Fruit rot',
        'Fruit discoloration',
        'Sunken spots on fruit',
        'Fruit cracking',
        'Premature fruit drop'
      ]
    },
    {
      id: 'root',
      title: 'Root Symptoms',
      symptoms: [
        'Root rot',
        'Root discoloration',
        'Stunted root growth',
        'Root lesions'
      ]
    },
    {
      id: 'general',
      title: 'General Symptoms',
      symptoms: [
        'Stunted growth',
        'Poor yield',
        'Plant death',
        'Reduced vigor',
        'Abnormal growth'
      ]
    }
  ];

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

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

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0 && !selectedImage) {
      setError('Please select at least one symptom or upload an image');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const diagnosisData = {
        plant_id: selectedPlant.id,
        symptoms: selectedSymptoms,
        image: imagePreview // Include base64 image if available
      };

      // Ensure token is passed if logged in
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // This uses raw fetch directly instead of the generic utils.js diagnoseDisease
      // because we need to explicitly inject the auth token for history saving
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(diagnosisData)
      });
      
      const result = await response.json();

      if (result.success) {
        // Store diagnosis result in localStorage
        localStorage.setItem('diagnosisResult', JSON.stringify(result));
        navigate('/diagnosis');
      } else {
        setError(result.error || 'Diagnosis failed. Please try again.');
      }
    } catch (err) {
      setError('Diagnosis failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Symptom Checker
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-md inline-block mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Selected Plant: {selectedPlant.name}
            </h2>
            <p className="text-gray-600 italic">{selectedPlant.scientific_name}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Symptom Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {symptomCategories.map(category => (
            <Card key={category.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">
                  {category.title}
                </CardTitle>
                <CardDescription>
                  Select all symptoms you observe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.symptoms.map(symptom => (
                    <div key={symptom} className="flex items-center space-x-3">
                      <Checkbox
                        id={symptom}
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <label
                        htmlFor={symptom}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Symptom Input */}
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Add Custom Symptom
            </CardTitle>
            <CardDescription>
              If you don't see your symptom listed above, describe it here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Describe your symptom..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
              />
              <Button
                onClick={handleAddCustomSymptom}
                disabled={!customSymptom.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Symptoms Summary */}
        {selectedSymptoms.length > 0 && (
          <Card className="shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">
                Selected Symptoms ({selectedSymptoms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(symptom => (
                  <span
                    key={symptom}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {symptom}
                    <button
                      onClick={() => handleSymptomToggle(symptom)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Optional Image Upload Section */}
        <Card className="shadow-md mb-8 border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
              <span>📷</span> Boost Accuracy with a Photo (Optional)
            </CardTitle>
            <CardDescription className="text-blue-700">
              Upload a clear photo of the affected plant part to have our AI analyze visual patterns alongside your checkboxes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-green-500 bg-green-50' : selectedImage ? 'border-green-300 bg-green-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('symptomImageInput').click()}
            >
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Selected plant" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                  <button 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ×
                  </button>
                  <p className="mt-2 text-sm text-green-700 font-medium">{selectedImage.name}</p>
                </div>
              ) : (
                <div className="py-2">
                  <div className="text-4xl mb-3 text-blue-300">🖼️</div>
                  <p className="text-gray-600 font-medium mb-1">Drag & drop your plant image here</p>
                  <p className="text-gray-400 text-sm">or click to browse files</p>
                </div>
              )}
              <input
                id="symptomImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Button
            onClick={() => navigate('/plant-selection')}
            variant="outline"
            className="mr-4"
          >
            ← Change Plant
          </Button>
          <Button
            onClick={handleDiagnose}
            disabled={(selectedSymptoms.length === 0 && !selectedImage) || loading}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                Analyzing...
              </>
            ) : (
              'Diagnose Disease'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;