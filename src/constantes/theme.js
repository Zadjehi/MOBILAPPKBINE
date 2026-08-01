// Couleurs/espacements portés de frontend/src/styles/_variables.scss — ce sont des
// valeurs PLACEHOLDER (héritées d'un socle technique, pas encore la charte Kbine
// définitive), à garder synchronisées avec le web si elles changent avant
// validation de la charte réelle.
export const couleurs = {
  principal: '#0F7A3D',
  secondaire: '#C2410C',
  accent: '#FB923C',
  fond: '#FAFAF9',
  texte: '#1F2937',
  texteSecondaire: '#6B7280',
  blanc: '#FFFFFF',
  grisClair: '#F3F4F6',
  bordure: '#E5E7EB',
  erreur: '#DC2626',
  succes: '#16A34A',
  avertissement: '#D97706',
  info: '#2563EB',
};

export const espacements = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

export const rayons = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  rond: 999,
};

export const taillesTexte = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Noms de familles de police tels qu'exposés par @expo-google-fonts — chargées
// dans App.js (useFonts). Mêmes polices que le web (frontend/src/pages/_document.js) :
// Playfair Display pour les titres, Inter pour le corps de texte.
export const polices = {
  titre: 'PlayfairDisplay_700Bold',
  corps: 'Inter_400Regular',
  corpsGras: 'Inter_600SemiBold',
};
