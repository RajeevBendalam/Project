import { handleLogin, handleRegister, toggleForms, handleGoogleAuth } from './auth.js';

// Attach event handlers to the global scope for HTML access
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.toggleForms = toggleForms;
window.handleGoogleAuth = handleGoogleAuth;