import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';

const UserHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setHistory(data);
        } else {
          setError(data.error || 'Failed to load history');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleViewDetails = async (item) => {
    // Toggle collapse if already expanded
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(item.id);

    // Don't re-fetch if already loaded
    if (diseaseDetails[item.disease_id]) return;

    setLoadingDetails(item.id);
    try {
      // Fetch disease info and treatments in parallel
      const [diseaseRes, treatmentsRes] = await Promise.all([
        fetch(`/api/diseases`),
        fetch(`/api/diseases/${item.disease_id}/treatments`)
      ]);

      const allDiseases = await diseaseRes.json();
      const treatmentsData = await treatmentsRes.json();

      // Find the specific disease from the list
      let disease = null;
      if (allDiseases.success && allDiseases.diseases) {
        disease = allDiseases.diseases.find(d => d.id === item.disease_id);
      }

      setDiseaseDetails(prev => ({
        ...prev,
        [item.disease_id]: {
          disease: disease,
          treatments: treatmentsData.success ? treatmentsData.treatments : []
        }
      }));
    } catch (err) {
      console.error('Failed to load disease details:', err);
    } finally {
      setLoadingDetails(null);
    }
  };

  const getEffectivenessColor = (effectiveness) => {
    if (effectiveness === 'high') return 'bg-green-100 text-green-800';
    if (effectiveness === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your diagnosis history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Diagnosis History</h1>
          <p className="text-gray-600">Review past diagnoses, treatments, and recommendations</p>
        </div>
      
        {error && <div className="text-red-500 bg-red-50 p-4 rounded mb-6 border border-red-200">⚠️ {error}</div>}

        {history.length === 0 && !error ? (
          <Card className="text-center py-12 max-w-md mx-auto shadow-md">
            <CardContent>
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
              <p className="text-gray-600 mb-6">You haven't performed any plant diagnoses yet.</p>
              <Button onClick={() => navigate('/plant-selection')} className="bg-green-600 hover:bg-green-700 text-white">
                Start a Diagnosis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {history.map((item) => (
              <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                        🌱 {item.plant_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        📅 {new Date(item.diagnosis_date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.disease_name === 'Healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.disease_name === 'Healthy' ? '✅ Healthy' : '⚠️ Diseased'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold text-gray-700">Diagnosis: </span>
                    <span className={`font-medium ${item.disease_name === 'Healthy' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.disease_name}
                    </span>
                  </div>
                  {item.symptoms_snapshot && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Symptoms: </span>
                      <span className="italic">
                        {(() => {
                          try {
                            const parsed = JSON.parse(item.symptoms_snapshot);
                            return Array.isArray(parsed) ? parsed.join(', ') : item.symptoms_snapshot;
                          } catch {
                            return item.symptoms_snapshot;
                          }
                        })()}
                      </span>
                    </div>
                  )}

                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => handleViewDetails(item)}
                  >
                    {expandedId === item.id ? '▲ Hide Details' : '▼ View Disease Details & Treatments'}
                  </Button>

                  {/* Expanded Disease Details Panel */}
                  {expandedId === item.id && (
                    <div className="mt-4 border-t pt-4 space-y-4 animate-in">
                      {loadingDetails === item.id ? (
                        <div className="text-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                          <p className="text-gray-500 text-sm">Loading disease details...</p>
                        </div>
                      ) : diseaseDetails[item.disease_id] ? (
                        <>
                          {/* Disease Info */}
                          {diseaseDetails[item.disease_id].disease && (
                            <div className="bg-white rounded-lg border p-4">
                              <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                                🦠 {diseaseDetails[item.disease_id].disease.name}
                              </h4>
                              <p className="text-gray-700 text-sm mb-3">
                                {diseaseDetails[item.disease_id].disease.description}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                <div className="bg-gray-50 rounded p-2">
                                  <span className="font-semibold text-gray-600 block">Pathogen</span>
                                  <span className="text-gray-800">{diseaseDetails[item.disease_id].disease.pathogen || 'N/A'}</span>
                                </div>
                                <div className="bg-gray-50 rounded p-2">
                                  <span className="font-semibold text-gray-600 block">Type</span>
                                  <span className="text-gray-800">{diseaseDetails[item.disease_id].disease.pathogen_type || 'N/A'}</span>
                                </div>
                                <div className="bg-gray-50 rounded p-2">
                                  <span className="font-semibold text-gray-600 block">Severity</span>
                                  <span className={`font-medium ${
                                    diseaseDetails[item.disease_id].disease.severity === 'High' ? 'text-red-600' :
                                    diseaseDetails[item.disease_id].disease.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                  }`}>{diseaseDetails[item.disease_id].disease.severity || 'N/A'}</span>
                                </div>
                              </div>

                              {/* Symptoms List */}
                              {diseaseDetails[item.disease_id].disease.symptoms && diseaseDetails[item.disease_id].disease.symptoms.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="font-semibold text-gray-700 text-sm mb-2">📋 Known Symptoms</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {diseaseDetails[item.disease_id].disease.symptoms.map((s, idx) => (
                                      <span key={idx} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200">
                                        {s.description || s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Treatments & Recommendations */}
                          {diseaseDetails[item.disease_id].treatments.length > 0 ? (
                            <div className="bg-white rounded-lg border p-4">
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                💊 Treatments & Recommendations
                              </h4>
                              <div className="space-y-3">
                                {diseaseDetails[item.disease_id].treatments.map((treatment, idx) => (
                                  <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                      <h5 className="font-semibold text-gray-800 text-sm">{treatment.method}</h5>
                                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEffectivenessColor(treatment.effectiveness)}`}>
                                        {treatment.effectiveness?.toUpperCase()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2">{treatment.description}</p>
                                    <div className="text-xs text-gray-500 space-y-0.5">
                                      {treatment.treatment_type && (
                                        <p><strong>Type:</strong> {treatment.treatment_type}</p>
                                      )}
                                      {treatment.application_timing && (
                                        <p><strong>Timing:</strong> {treatment.application_timing}</p>
                                      )}
                                      {treatment.precautions && (
                                        <p><strong>⚠️ Precautions:</strong> {treatment.precautions}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                              No specific treatment recommendations available for this disease.
                            </div>
                          )}

                          {/* General Recommendations */}
                          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              💡 General Recommendations
                            </h4>
                            <ul className="text-blue-800 text-sm space-y-1">
                              <li>• Monitor the plant for symptom progression over 3-5 days</li>
                              <li>• Isolate affected plants to prevent spread</li>
                              <li>• Ensure proper watering and drainage</li>
                              <li>• Consider consulting a local agricultural expert for confirmation</li>
                              <li>• Take follow-up photos to track treatment effectiveness</li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          Could not load disease details. Please try again.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/plant-selection')} className="bg-green-600 hover:bg-green-700 text-white px-6">
            🌿 Start New Diagnosis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHistory;
