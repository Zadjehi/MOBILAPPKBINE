// Doit rester identique au calcul backend (backend/src/controleurs/commandesControleur.js,
// fonction calculerCommission) et à sa copie dans
// frontend/src/pages/espace-client/decouvrir.js — 2 FCFA fixe + 2,5% du montant
// (couvre les 2,25% prélevés réellement par PayDunya). Si le backend change
// ces valeurs, répercuter le changement ici ET dans le frontend web.
export const COMMISSION_FIXE = 2;
export const COMMISSION_POURCENT = 0.025;

export function calculerCommission(montant) {
  return COMMISSION_FIXE + Math.round((parseFloat(montant) || 0) * COMMISSION_POURCENT);
}

// Formatage FCFA en groupes de 3 chiffres — repli manuel à toLocaleString('fr-FR'),
// dont le support Intl est parfois incomplet sur Hermes (RN) selon la configuration.
export function formaterFcfa(montant) {
  const nombre = Math.round(parseFloat(montant) || 0);
  return nombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
