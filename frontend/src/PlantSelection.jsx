import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlants } from './utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';

const getPlantEmoji = (id) => {
  const emojis = {
    rice: '🌾',
    wheat: '🌾',
    corn: '🌽',
    barley: '🌾',
    sorghum: '🌾',
    millets: '🌾',
    oats: '🌾',
    tomato: '🍅',
    potato: '🥔',
    onion: '🧅',
    chili: '🌶️',
    cabbage: '🥬',
    cauliflower: '🥦',
    spinach: '🥬',
    broccoli: '🥦',
    peas: '🫛',
    beans: '🫘',
    cucumber: '🥒',
    pumpkin: '🎃',
    carrot: '🥕',
    garlic: '🧄',
    eggplant: '🍆',
    lettuce: '🥬',
    apple: '🍎',
    mango: '🥭',
    banana: '🍌',
    citrus: '🍊',
    grape: '🍇',
    strawberry: '🍓',
    papaya: '🥭',
    pomegranate: '🍎',
    guava: '🍏',
    watermelon: '🍉',
    pineapple: '🍍',
    coconut: '🥥',
    peach: '🍑',
    cotton: '☁️',
    soybean: '🫛',
    sugarcane: '🎋',
    tea: '🍃',
    coffee: '☕',
    tobacco: '🍂',
    groundnut: '🥜',
    mustard: '🌼',
    rubber: '🌳',
    jute: '🌾'
  };
  return emojis[id] || '🌱';
};

const PlantSelection = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      const data = await getPlants();
      if (data.success) {
        setPlants(data.plants);
      } else {
        setError('Failed to load plants');
      }
    } catch (err) {
      setError('Failed to load plants: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Plants', icon: '🌱' },
    { id: 'cereals', label: 'Cereal Crops', icon: '🌾' },
    { id: 'vegetables', label: 'Vegetable Crops', icon: '🥕' },
    { id: 'fruits', label: 'Fruit Crops', icon: '🍎' },
    { id: 'cash_crops', label: 'Cash Crops', icon: '💰' }
  ];

  const filteredPlants = selectedCategory === 'all'
    ? plants
    : plants.filter(plant => plant.category === selectedCategory);

  const handlePlantSelect = (plant) => {
    // Store selected plant in localStorage for use in other components
    localStorage.setItem('selectedPlant', JSON.stringify(plant));
    navigate('/symptom-checker');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <Button onClick={loadPlants} className="bg-green-600 hover:bg-green-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Select Your Plant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plant you want to diagnose. We support cereals, vegetables, fruits, and cash crops.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-6 py-2 ${
                selectedCategory === category.id
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'border-green-600 text-green-600 hover:bg-green-50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredPlants.map(plant => (
            <Card
              key={plant.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300"
              onClick={() => handlePlantSelect(plant)}
            >
              <div className="w-full h-44 bg-gradient-to-br from-green-100 to-emerald-200 relative overflow-hidden flex items-center justify-center rounded-t-lg">
                {plant.image_path ? (
                  <img 
                    src={plant.image_path} 
                    alt={plant.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl">{getPlantEmoji(plant.id)}</span>
                  </div>
                </div>
              </div>
              <CardHeader className="text-center pt-4">
                <CardTitle className="text-xl text-gray-800">
                  {plant.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 italic">
                  {plant.scientific_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center mb-4">
                  {plant.description}
                </p>
                <div className="text-center">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {plant.category_label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plants found in this category.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mr-4"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlantSelection;