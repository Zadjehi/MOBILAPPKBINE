import axios from 'axios';

// Port de frontend/src/services/apiPublique.js — mêmes endpoints publics,
// aucune authentification (pas de jeton) puisque le parcours invité n'en a
// pas besoin.
const apiPublique = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 8000,
});

export default apiPublique;
