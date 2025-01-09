const isLocalhost = window.location.hostname === 'localhost';

const config = {
  apiBaseUrl: isLocalhost
    ? 'http://localhost:8080/api/v1' // URL pour l'environnement local
    : 'https://api.greentrip.us/api/v1', // URL pour l'environnement de production
};

export default config;
