// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',  // Flask backend port
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    CURRENT_TIME: '2025-03-17 12:55:39',
    CURRENT_USER: 'Miranics'
};

// API Service for authentication
const ApiService = {
    auth: {
        // Login endpoint
        login: async (loginData) => {
            try {
                console.log('Login attempt for:', loginData.username);
                const response = await fetch(`${API_CONFIG.BASE_URL}/login`, { // Changed to match Flask endpoint
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
                    throw new Error(data.message || 'Login failed');
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
                // Adjusted data structure to match your Flask backend
                const registrationData = {
                    username: userData.username,
                    password: userData.password,
                    email: userData.email,
                    fullname: userData.fullname,
                    role: userData.userType  // Changed userType to role to match backend
                };

                const response = await fetch(`${API_CONFIG.BASE_URL}/register`, { // Changed to match Flask endpoint
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify(registrationData),
                    mode: 'cors'
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                console.log('Registration successful');
                return data;
            } catch (error) {
                console.error('Registration error:', error.message);
                throw error;
            }
        },

        // Clear session
        logout: () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('username');
            localStorage.removeItem('login_time');
            window.location.href = '/index.html';
        },

        // Check if user is logged in
        isLoggedIn: () => {
            return localStorage.getItem('access_token') !== null;
        }
    }
};

// Initialize API service
console.log(`API Service initialized at ${API_CONFIG.CURRENT_TIME}`);