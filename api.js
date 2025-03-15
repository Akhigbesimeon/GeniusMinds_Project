// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:5000',
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    CURRENT_TIME: '2025-03-15 17:58:31',
    CURRENT_USER: 'Miranics'
};

// API Service for authentication
const ApiService = {
    auth: {
        // Login endpoint
        login: async (loginData) => {
            try {
                console.log('Login attempt for:', loginData.username);
                const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
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
                const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
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
        },

        // Clear session if on login page
        clearSessionIfLoginPage: () => {
            const isLoginPage = window.location.pathname.includes('index.html') || 
                              window.location.pathname === '/' || 
                              window.location.pathname === '';
            
            if (isLoginPage) {
                ApiService.auth.logout();
                return true;
            }
            return false;
        }
    }
};

// Initialize API service and handle session
console.log(`API Service initialized at ${API_CONFIG.CURRENT_TIME}`);
ApiService.auth.clearSessionIfLoginPage();