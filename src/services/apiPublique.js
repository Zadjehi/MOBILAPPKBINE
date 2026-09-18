import axios from 'axios';

// Port de frontend/src/services/apiPublique.js — mêmes endpoints publics,
// aucune authentification (pas de jeton) puisque le parcours invité n'en a
// pas besoin.
//
// Délai à 20s (pas 8s) : le backend de prod tourne sur Render en offre
// gratuite, qui met le service en veille après une période d'inactivité —
// le réveil ("cold start") peut prendre 10 à 30s de plus que la normale.
// Risque déjà identifié au moment de construire cette appli (voir l'historique
// du projet) mais jamais corrigé : avec 8s, un client qui tombe sur un
// backend endormi recevait une fausse erreur ("Impossible d'enregistrer la
// commande") alors que la requête aurait fini par aboutir.
const apiPublique = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 20000,
});

export default apiPublique;
