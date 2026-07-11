import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { apiCall } from './utils';

const TreatmentRecommendations = ({ diseaseId, onBack }) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const data = await apiCall(`/api/treatments/${diseaseId}`);
        setTreatments(data);
      } catch (err) {
        setError('Failed to load treatment recommendations');
        console.error('Error fetching treatments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (diseaseId) {
      fetchTreatments();
    }
  }, [diseaseId]);

  const filteredTreatments = treatments.filter(treatment => {
    if (filter === 'all') return true;
    return treatment.type.toLowerCase() === filter;
  });

  const getTreatmentTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'chemical':
        return 'bg-red-100 text-red-800';
      case 'organic':
        return 'bg-green-100 text-green-800';
      case 'cultural':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading treatment recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={onBack}
              variant="outline"
              className="mb-4"
            >
              ← Back to Results
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Treatment Recommendations
            </h1>
            <p className="text-gray-600">
              Comprehensive treatment options for your plant's condition
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All Treatments
              </Button>
              <Button
                variant={filter === 'chemical' ? 'default' : 'outline'}
                onClick={() => setFilter('chemical')}
                size="sm"
              >
                Chemical
              </Button>
              <Button
                variant={filter === 'organic' ? 'default' : 'outline'}
                onClick={() => setFilter('organic')}
                size="sm"
              >
                Organic
              </Button>
              <Button
                variant={filter === 'cultural' ? 'default' : 'outline'}
                onClick={() => setFilter('cultural')}
                size="sm"
              >
                Cultural
              </Button>
            </div>
          </div>

          {/* Treatments List */}
          {filteredTreatments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">
                  No treatments found for the selected filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredTreatments.map((treatment, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-900">
                        {treatment.name}
                      </CardTitle>
                      <Badge className={getTreatmentTypeColor(treatment.type)}>
                        {treatment.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Description
                        </h4>
                        <p className="text-gray-700">{treatment.description}</p>
                      </div>

                      {/* Application Method */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Application Method
                        </h4>
                        <p className="text-gray-700">{treatment.application_method}</p>
                      </div>

                      {/* Effectiveness */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Effectiveness
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${treatment.effectiveness}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {treatment.effectiveness}%
                          </span>
                        </div>
                      </div>

                      {/* Precautions */}
                      {treatment.precautions && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Precautions
                          </h4>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-800 text-sm">
                              ⚠️ {treatment.precautions}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Timing */}
                      {treatment.timing && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Best Time to Apply
                          </h4>
                          <p className="text-gray-700">{treatment.timing}</p>
                        </div>
                      )}

                      {/* Product Link */}
                      {treatment.product_link && (
                        <div className="pt-4 border-t border-gray-100">
                           <a 
                             href={treatment.product_link}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center text-green-700 font-medium hover:text-green-800"
                           >
                             🛒 Buy Recommended Product
                             <span className="ml-1 text-lg">↗</span>
                           </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Additional Information */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Important Notes
                  </h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Always follow label instructions for chemical treatments</li>
                    <li>• Test treatments on a small area first</li>
                    <li>• Monitor plant response and adjust as needed</li>
                    <li>• Consult local agricultural extension for region-specific advice</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreatmentRecommendations;