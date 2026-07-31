// Doit rester identique à la validation utilisée dans
// frontend/src/pages/espace-client/decouvrir.js (validerNumero).
export const REGEX_TELEPHONE_CI = /^0\d{9}$/;

export function nettoyerChiffres(valeur) {
  return String(valeur || '').replace(/\D/g, '');
}

export function numeroValide(valeur) {
  return REGEX_TELEPHONE_CI.test(nettoyerChiffres(valeur));
}

// Vérifie que le préfixe du numéro correspond bien à l'opérateur sélectionné,
// à partir de la liste de préfixes publique (/catalogue/prefixes/public).
// Renvoie un message d'erreur (string) si incohérence, ou null si tout va bien
// ou si la vérification n'est pas possible (liste de préfixes vide).
export function trouverIncoherenceOperateur(valeur, operateur, prefixes, libellesOperateur) {
  if (!prefixes || prefixes.length === 0) return null;
  const chiffres = nettoyerChiffres(valeur);
  const prefixeNumero = chiffres.slice(0, 2);
  const correspondance = prefixes.find((p) => p.prefixe === prefixeNumero);
  if (!correspondance) {
    return "Ce numéro n'est reconnu chez aucun opérateur.";
  }
  if (correspondance.operateur !== operateur) {
    const nomTrouve = libellesOperateur[correspondance.operateur] || correspondance.operateur;
    const nomAttendu = libellesOperateur[operateur] || operateur;
    return `Ce numéro semble être un numéro ${nomTrouve}, pas ${nomAttendu}.`;
  }
  return null;
}
