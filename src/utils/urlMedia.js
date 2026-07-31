// Port de frontend/src/utils/urlMedia.js — construit l'URL absolue d'un média
// (logo, photo...) servi par le backend à partir d'un chemin relatif.
const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const BASE = process.env.EXPO_PUBLIC_BACKEND_URL || API.replace(/\/api\/v1\/?$/, '');

export function urlMedia(chemin) {
  if (!chemin) return null;
  if (chemin.startsWith('http') || chemin.startsWith('data:')) return chemin;
  return `${BASE}${chemin}`;
}
