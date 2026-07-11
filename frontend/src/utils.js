// API configuration
const API_BASE_URL = '/api';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Plant-related API calls
export const getPlants = () => apiCall('/plants');
export const getPlant = (plantId) => apiCall(`/plants/${plantId}`);
export const getPlantDiseases = (plantId) => apiCall(`/plants/${plantId}/diseases`);

// Diagnosis API calls
export const diagnoseDisease = (data) => apiCall('/diagnose', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Disease API calls
export const getAllDiseases = () => apiCall('/diseases');
export const getDiseaseTreatments = (diseaseId) => apiCall(`/diseases/${diseaseId}/treatments`);