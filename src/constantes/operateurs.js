// Doit rester identique aux constantes équivalentes dans
// frontend/src/pages/espace-client/decouvrir.js (LIBELLES_OPERATEUR, COULEURS_OPERATEUR).
export const LIBELLES_OPERATEUR = { orange: 'Orange', moov: 'Moov', mtn: 'MTN' };
export const COULEURS_OPERATEUR = { orange: '#FF7900', moov: '#0072CE', mtn: '#FFCC00' };
export const LIBELLES_CATEGORIE = { internet: 'Internet', appel: 'Appel', sms: 'SMS', combo: 'Combo', autre: 'Autre' };

// Logos bundlés localement (pas de dépendance réseau pour de la branding statique)
// — voir frontend/src/utils/logosOperateurs.js.
export const LOGOS_OPERATEUR = {
  orange: require('../../assets/logos-operateurs/orange.jpg'),
  moov: require('../../assets/logos-operateurs/moov.jpg'),
  mtn: require('../../assets/logos-operateurs/mtn.png'),
};
