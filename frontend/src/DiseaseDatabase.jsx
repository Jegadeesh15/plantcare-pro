import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { getAllDiseases } from './utils';

const DiseaseDatabase = () => {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [filterByPlant, setFilterByPlant] = useState('all');

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        const data = await getAllDiseases();
        if (data.success) {
          setDiseases(data.diseases);
          setFilteredDiseases(data.diseases);
        } else {
          setError('Failed to load disease database');
        }
      } catch (err) {
        setError('Failed to load disease database');
        console.error('Error fetching diseases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  useEffect(() => {
    let filtered = diseases;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.plant_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by plant
    if (filterByPlant !== 'all') {
      filtered = filtered.filter(disease =>
        disease.plant_name.toLowerCase().includes(filterByPlant.toLowerCase())
      );
    }

    setFilteredDiseases(filtered);
  }, [searchTerm, filterByPlant, diseases]);

  const getSeverityColor = (severity) => {
    if (!severity) return 'bg-gray-100 text-gray-800';
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniquePlants = () => {
    const plants = [...new Set(diseases.map(disease => disease.plant_name))];
    return plants.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading disease database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Plant Disease Database
            </h1>
            <p className="text-gray-600">
              Comprehensive database of plant diseases with symptoms and treatments
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Diseases
                  </label>
                  <Input
                    type="text"
                    placeholder="Search by disease name, symptoms, or plant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Plant
                  </label>
                  <select
                    value={filterByPlant}
                    onChange={(e) => setFilterByPlant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Plants</option>
                    {getUniquePlants().map(plant => (
                      <option key={plant} value={plant}>{plant}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredDiseases.length} of {diseases.length} diseases
            </p>
          </div>

          {/* Disease List */}
          {filteredDiseases.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">
                  No diseases found matching your search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiseases.map((disease) => (
                <Card
                  key={disease.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDisease(disease)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg text-gray-900">
                        {disease.name}
                      </CardTitle>
                      <Badge className={getSeverityColor(disease.severity)}>
                        {disease.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      {disease.plant_name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {disease.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {disease.symptoms?.length || 0} symptoms
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Disease Detail Modal */}
          {selectedDisease && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedDisease.name}
                      </h2>
                      <p className="text-green-600 font-medium">
                        {selectedDisease.plant_name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(selectedDisease.severity)}>
                        {selectedDisease.severity} severity
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDisease(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700">{selectedDisease.description}</p>
                    </div>

                    {/* Symptoms */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Common Symptoms
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {selectedDisease.symptoms?.map((symptom, index) => (
                          <li key={index}>{symptom.description}</li>
                        )) || <li>No symptoms listed</li>}
                      </ul>
                    </div>

                    {/* Causes */}
                    {selectedDisease.causes && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Causes
                        </h3>
                        <p className="text-gray-700">{selectedDisease.causes}</p>
                      </div>
                    )}

                    {/* Prevention */}
                    {selectedDisease.prevention && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Prevention
                        </h3>
                        <p className="text-gray-700">{selectedDisease.prevention}</p>
                      </div>
                    )}

                    {/* Treatments */}
                    {selectedDisease.treatments && selectedDisease.treatments.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Treatment Options
                        </h3>
                        <div className="space-y-3">
                          {selectedDisease.treatments.map((treatment, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {treatment.name}
                                </h4>
                                <Badge className="text-xs">
                                  {treatment.type}
                                </Badge>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {treatment.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDatabase;