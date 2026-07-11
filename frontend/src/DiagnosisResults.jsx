import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiseaseTreatments } from './utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';

const DiagnosisResults = () => {
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load diagnosis result from localStorage
    const result = localStorage.getItem('diagnosisResult');
    if (result) {
      const parsedResult = JSON.parse(result);
      setDiagnosisResult(parsedResult);
      // Auto-select the top result
      if (parsedResult.diagnosis_results && parsedResult.diagnosis_results.length > 0) {
        handleDiseaseSelect(parsedResult.diagnosis_results[0]);
      }
    } else {
      navigate('/symptom-checker');
    }
  }, [navigate]);

  const handleDiseaseSelect = async (diagnosis) => {
    setSelectedDisease(diagnosis);
    try {
      setLoading(true);
      const treatmentData = await getDiseaseTreatments(diagnosis.disease.id);
      if (treatmentData.success) {
        setTreatments(treatmentData.treatments);
      }
    } catch (error) {
      console.error('Failed to load treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (!diagnosisResult) {
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
            Diagnosis Results
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-md inline-block">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Plant: {diagnosisResult.plant?.name}
            </h2>
            <p className="text-gray-600">
              Symptoms analyzed: {diagnosisResult.user_symptoms?.join(', ')}
            </p>
          </div>
        </div>

        {diagnosisResult.mismatch_warning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 shadow-sm rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Potential Species Mismatch</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{diagnosisResult.mismatch_warning}</p>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Diagnosis Results */}
          <div>
            <Card className="shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Possible Diseases
                </CardTitle>
                <CardDescription>
                  Ranked by likelihood based on your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diagnosisResult.diagnosis_results?.map((result, index) => (
                    <div
                      key={result.disease.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDisease?.disease.id === result.disease.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleDiseaseSelect(result)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            #{index + 1} {result.disease.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {result.disease.pathogen} ({result.disease.pathogen_type})
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                          {Math.round(result.confidence)}%
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{getConfidenceLabel(result.confidence)}</span>
                          <span>{result.match_details?.length || 0} symptoms matched</span>
                        </div>
                        <Progress value={result.confidence} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Treatment Recommendations */}
          <div>
            {selectedDisease && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Treatment Recommendations
                  </CardTitle>
                  <CardDescription>
                    For: {selectedDisease.disease.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading treatments...</p>
                    </div>
                  ) : treatments.length > 0 ? (
                    <div className="space-y-4">
                      {treatments.map(treatment => (
                        <div key={treatment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {treatment.method}
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              treatment.effectiveness === 'high' ? 'bg-green-100 text-green-800' :
                              treatment.effectiveness === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {treatment.effectiveness.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">
                            {treatment.description}
                          </p>
                          <div className="text-xs text-gray-600">
                            <p><strong>Type:</strong> {treatment.treatment_type}</p>
                            {treatment.application_timing && (
                              <p><strong>Timing:</strong> {treatment.application_timing}</p>
                            )}
                            {treatment.precautions && (
                              <p><strong>Precautions:</strong> {treatment.precautions}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No treatments available for this disease.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <Button
            onClick={() => navigate('/symptom-checker')}
            variant="outline"
          >
            ← Check Different Symptoms
          </Button>
          <Button
            onClick={() => navigate('/plant-selection')}
            variant="outline"
          >
            Change Plant
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700"
          >
            Start New Diagnosis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResults;