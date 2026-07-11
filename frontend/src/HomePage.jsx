import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const features = [
    { icon: '🔬', title: 'AI-Powered Diagnosis', description: 'Advanced machine learning algorithms provide accurate disease identification with 95% confidence.' },
    { icon: '🌱', title: 'Comprehensive Plant Database', description: 'Support for 46+ plants across cereals, vegetables, fruits, and cash crops with 65+ diseases.' },
    { icon: '📋', title: 'Interactive Symptom Checker', description: 'Easy-to-use interface to describe plant symptoms across different plant parts.' },
    { icon: '📷', title: 'Image Analysis', description: 'Upload plant photos for AI-powered visual disease detection and pattern analysis.' },
    { icon: '💊', title: 'Treatment Recommendations', description: 'Evidence-based treatment options including chemical, organic, and cultural methods.' },
    { icon: '📊', title: 'Disease Database', description: '65+ plant diseases with detailed symptoms, causes, treatments, and prevention strategies.' },
  ];

  const stats = [
    { number: '95%', label: 'Accuracy Rate' },
    { number: '65+', label: 'Plant Diseases' },
    { number: '46+', label: 'Supported Plants' },
    { number: '8+', label: 'Crop Categories' },
  ];

  const modules = [
    { icon: '🌱', title: 'Plant Selection', desc: 'Database-driven plant catalog with search, filter, and structured browsing across categories.', link: '/plant-selection' },
    { icon: '📋', title: 'Symptom Checker', desc: 'Describe symptoms by plant part — leaf, stem, root, fruit, general — with checkbox-based multi-selection.', link: '/symptom-checker' },
    { icon: '🤖', title: 'AI Diagnosis Engine', desc: 'Rule-based symptom matching with weighted confidence scoring: exact, partial, synonym, and category matching.', link: '/plant-selection' },
    { icon: '📷', title: 'Image Analysis', desc: 'Upload plant photos for AI-powered visual pattern detection and disease identification.', link: '/image-analysis' },
    { icon: '💊', title: 'Treatment Recommendations', desc: 'Detailed chemical, organic, and cultural treatment options filtered by effectiveness and severity.', link: '/plant-selection' },
    { icon: '📚', title: 'Disease Database', desc: 'Searchable repository for diseases, symptoms, treatments, and filters by pathogen type and plant.', link: '/database' },
  ];

  const cropCategories = [
    { label: 'Cereals', icon: '🌾', crops: ['Rice', 'Wheat', 'Corn/Maize', 'Barley', 'Sorghum', 'Millets', 'Oats'] },
    { label: 'Vegetables', icon: '🥬', crops: ['Tomato', 'Potato', 'Onion', 'Chili', 'Cabbage', 'Cauliflower', 'Spinach', 'Broccoli', 'Peas', 'Beans', 'Cucumber', 'Pumpkin', 'Carrot', 'Garlic', 'Eggplant', 'Lettuce'] },
    { label: 'Fruits', icon: '🍎', crops: ['Apple', 'Mango', 'Banana', 'Citrus', 'Grape', 'Strawberry', 'Papaya', 'Pomegranate', 'Guava', 'Watermelon', 'Pineapple', 'Coconut', 'Peach'] },
    { label: 'Cash Crops', icon: '💰', crops: ['Cotton', 'Soybean', 'Sugarcane', 'Tea', 'Coffee', 'Tobacco', 'Groundnut', 'Mustard', 'Rubber', 'Jute'] },
  ];

  const methodology = [
    { step: '1', title: 'Preprocessing', desc: 'Normalize symptoms using lowercase, stop word removal, punctuation cleaning, and synonym normalization.' },
    { step: '2', title: 'Keyword Matching', desc: 'Split symptoms into keywords and match against stored disease symptom keywords in the database.' },
    { step: '3', title: 'Weighted Scoring', desc: 'Exact match 100%, partial 70%, synonym 80%, category 50% — combined into a weighted confidence score.' },
    { step: '4', title: 'Ranking & Results', desc: 'Ranked by confidence, match count, and severity with links to detailed treatment recommendations.' },
  ];

  const loggedOutImage = "/img/StockCake-Serene_Agricultural_Field-802497-medium.jpg";
  const loggedInImage = "/img/StockCake-Serene_Agricultural_Field-802497-medium.jpg";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen w-full flex items-center" style={{backgroundImage: `url('/img/StockCake-Serene_Agricultural_Field-802497-medium.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-12">
            {token ? (
              <>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}!
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
                  Ready to ensure the health of your crops today? Let's catch those diseases early and maximize your yield.
                </p>
                <div className="space-x-4">
                  <Button
                    onClick={() => navigate('/plant-selection')}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    Diagnose New Plant
                  </Button>
                  <Button
                    onClick={() => navigate('/history')}
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 px-8 py-4 text-lg shadow-lg"
                  >
                    View Diagnosis History
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
                  AI-Powered Plant Disease<br />
                  <span className="text-green-500">Diagnosis & Treatment</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-4xl mx-auto drop-shadow-lg font-light">
                  Identify plant diseases instantly with our advanced AI technology. Get professional treatment recommendations to save your crops and maximize yields.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                  <Button
                    onClick={() => navigate('/plant-selection')}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-7 text-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 rounded-lg flex items-center gap-2"
                  >
                    Start Free Diagnosis <span>&rarr;</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/database')}
                    variant="outline"
                    className="border-white/40 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 px-10 py-7 text-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 rounded-lg"
                  >
                    Browse Disease Database
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Stats - moved inside hero container but still below main content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2 drop-shadow-sm">{stat.number}</div>
                <div className="text-white font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose PlantCare Pro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with agricultural expertise
              to provide reliable plant disease diagnosis and treatment solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Core Modules Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Core Modules</h2>
            <p className="text-lg text-gray-600">All the tools you need for comprehensive plant disease management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300" onClick={() => navigate(mod.link)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mod.icon}</span>
                    <CardTitle className="text-lg text-gray-800">{mod.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{mod.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Crops Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Supported Crops</h2>
            <p className="text-lg text-gray-600">Comprehensive coverage across all major crop categories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cropCategories.map((cat, index) => (
              <Card key={index} className="border-2 hover:border-green-200 hover:shadow-lg transition-all">
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <CardTitle className="text-lg text-gray-800">{cat.label}</CardTitle>
                  <CardDescription>{cat.crops.length} crops supported</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {cat.crops.map((crop, i) => (
                      <span key={i} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">{crop}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works / Methodology Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our AI Methodology</h2>
            <p className="text-lg text-gray-600">How our diagnosis engine achieves 95% accuracy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {methodology.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Advantages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🎯', title: 'Superior Accuracy', desc: '95% accuracy rate, significantly higher than industry average.' },
              { icon: '📦', title: 'Comprehensive', desc: 'Holistic approach with chemical, organic, and cultural management options.' },
              { icon: '⚡', title: 'Instant & Accessible', desc: 'Real-time results on desktop and mobile devices.' },
              { icon: '📈', title: 'Scalable', desc: 'Built for rapid expansion with image-based diagnosis and more crops.' },
            ].map((adv, index) => (
              <div key={index} className="text-center p-6 border-2 rounded-lg hover:border-green-300 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{adv.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{adv.title}</h3>
                <p className="text-gray-600 text-sm">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Diagnose Your Plant?</h2>
          <p className="text-xl mb-8 opacity-90">Start your free diagnosis now and get expert recommendations in minutes.</p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate('/plant-selection')}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Diagnosis
            </Button>
            <Button
              onClick={() => navigate('/image-analysis')}
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 text-lg font-semibold border border-white"
            >
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;