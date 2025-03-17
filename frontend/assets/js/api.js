// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000', // Changed to match server port
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    CURRENT_TIME: '2025-03-17 11:11:25',
    CURRENT_USER: 'Miranics'
};

// API Service for authentication
const ApiService = {
    auth: {
        // Login endpoint
        login: async (loginData) => {
            try {
                console.log('Login attempt for:', loginData.username);
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify({
                        username: loginData.username,
                        password: loginData.password
                    }),
                    mode: 'cors'
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }
                
                console.log('Login response received');
                return data;
            } catch (error) {
                console.error('Login error:', error.message);
                throw error;
            }
        },

        // Registration endpoint
        register: async (userData) => {
            try {
                console.log('Registration attempt for:', userData.username);
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify(userData),
                    mode: 'cors'
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed');
                }

                console.log('Registration successful');
                return data;
            } catch (error) {
                console.error('Registration error:', error.message);
                throw error;
            }
        }
    }
};

// Initialize API service
console.log(`API Service initialized at ${API_CONFIG.CURRENT_TIME}`);