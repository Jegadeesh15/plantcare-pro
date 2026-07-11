import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import PlantSelection from './PlantSelection';
import SymptomChecker from './SymptomChecker';
import DiagnosisResults from './DiagnosisResults';
import TreatmentRecommendations from './TreatmentRecommendations';
import DiseaseDatabase from './DiseaseDatabase';
import ImageAnalysis from './ImageAnalysis';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import UserHistory from './UserHistory';

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/plant-selection" element={<PlantSelection />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />
      <Route path="/diagnosis" element={<DiagnosisResults />} />
      <Route path="/treatment" element={<TreatmentRecommendations />} />
      <Route path="/database" element={<DiseaseDatabase />} />
      <Route path="/image-analysis" element={<ImageAnalysis />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/history" element={<UserHistory />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;