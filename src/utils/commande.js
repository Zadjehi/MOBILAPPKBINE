// Doit rester identique au calcul backend (backend/src/controleurs/commandesControleur.js,
// fonction calculerCommission) et à sa copie dans
// frontend/src/pages/espace-client/decouvrir.js — 2 FCFA fixe + 1% du montant
// (couvre la commission Wave de ~1% prélevée sur chaque encaissement). Si le
// backend change ces valeurs, répercuter le changement ici ET dans le frontend web.
export const COMMISSION_FIXE = 2;
export const COMMISSION_POURCENT = 0.01;

export function calculerCommission(montant) {
  return COMMISSION_FIXE + Math.round((parseFloat(montant) || 0) * COMMISSION_POURCENT);
}

// Construit le lien de paiement marchand Wave avec le montant exact pré-rempli —
// identique à decouvrir.js (lienWave).
export function construireLienWave(waveLienBase, montantAPayer) {
  if (!waveLienBase) return null;
  const separateur = waveLienBase.includes('?') ? '&' : '?';
  return `${waveLienBase}${separateur}amount=${Math.round(montantAPayer)}`;
}

// Formatage FCFA en groupes de 3 chiffres — repli manuel à toLocaleString('fr-FR'),
// dont le support Intl est parfois incomplet sur Hermes (RN) selon la configuration.
export function formaterFcfa(montant) {
  const nombre = Math.round(parseFloat(montant) || 0);
  return nombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
