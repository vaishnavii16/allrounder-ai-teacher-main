import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Authentication error - check API key configuration');
    } else if (error.response?.status >= 500) {
      console.error('Server error - backend may be down');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - backend server may not be running');
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const aiService = {
  /**
   * Get educational response for any topic
   * @param {string} question - The question to ask
   * @param {string} topic - The subject/topic area
   * @param {string} level - The difficulty level ('beginner', 'intermediate', 'advanced')
   * @returns {Promise<Object>} Educational response data
   */
  async getEducationalResponse(question, topic = 'General', level = 'intermediate') {
    try {
      const response = await api.get('/api/ai', {
        params: { question, topic, level },
        timeout: 45000 // Increase timeout for retries
      });
      return response.data;
    } catch (error) {
      console.error('Educational API error:', error);
      
      // Handle specific error cases with user-friendly messages
      if (error.response?.status === 503) {
        const errorData = error.response.data;
        const retryAfter = errorData.retryAfter ? Math.round(errorData.retryAfter / 1000) : 30;
        throw new Error(
          `AI service is temporarily busy. Please try again in ${retryAfter} seconds. The AI model is experiencing high traffic right now.`
        );
      }
      
      if (error.response?.status === 429) {
        throw new Error(
          'Too many requests. Please wait a moment before asking another question.'
        );
      }
      
      if (error.response?.status === 401) {
        throw new Error(
          'Authentication error. Please check if the backend server is properly configured.'
        );
      }
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          'Cannot connect to backend server. Please make sure the backend is running on port 5000.'
        );
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error(
          'Request timed out. The AI service may be slow right now. Please try again.'
        );
      }
      
      // Use the error message from the server if available
      const serverMessage = error.response?.data?.error;
      throw new Error(
        serverMessage || 
        'Failed to get educational response. Please check if the backend server is running and try again.'
      );
    }
  },

  /**
   * Legacy method for backwards compatibility (Japanese translation)
   * @param {string} question - The English question to translate
   * @param {string} speech - 'formal' or 'casual'
   * @returns {Promise<Object>} Translation data
   */
  async getTranslation(question, speech = 'formal') {
    // Convert to the new format for Japanese learning
    return this.getEducationalResponse(
      `How do you say "${question}" in Japanese using ${speech} speech?`, 
      'Japanese Language', 
      'intermediate'
    );
  },

  /**
   * Health check for the backend
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend server is not responding');
    }
  }
};

export default api;
