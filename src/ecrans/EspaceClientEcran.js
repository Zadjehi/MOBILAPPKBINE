import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bouton, Chargeur } from '../composants/communs';
import apiPublique from '../services/apiPublique';
import { urlMedia } from '../utils/urlMedia';
import { couleurs, espacements, taillesTexte, polices } from '../constantes/theme';

// Port de frontend/src/pages/espace-client/index.js — écran d'accueil, fetch
// /parametres/public pour le nom/logo/description du site, un seul bouton
// vers l'écran Découvrir (pas d'inscription/connexion, pareil que le web
// actuellement : masquées en attendant que ce parcours soit prêt).
const TAGLINE_DEFAUT = 'Rechargez votre crédit Orange, Moov ou MTN à distance, en ligne.';

// Dégradé identique à .app-ecran (frontend/src/styles/composants/_app-mobile.scss) :
// linear-gradient(160deg, accent 0%, blanc 48%, blanc 52%, principal 100%).
export function FondDegradeEcran({ children }) {
  return (
    <LinearGradient
      colors={[couleurs.accent, couleurs.blanc, couleurs.blanc, couleurs.principal]}
      locations={[0, 0.48, 0.52, 1]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={styles.ecran}
    >
      {children}
    </LinearGradient>
  );
}

export default function EspaceClientEcran({ navigation }) {
  const [parametres, setParametres] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    apiPublique.get('/parametres/public')
      .then(({ data }) => setParametres(data.donnees?.parametre))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const nomSite = parametres?.nom_site || 'Kbine';

  if (chargement) {
    return (
      <FondDegradeEcran>
        <SafeAreaView style={styles.centre}>
          <Chargeur taille="lg" />
        </SafeAreaView>
      </FondDegradeEcran>
    );
  }

  return (
    <FondDegradeEcran>
      <SafeAreaView style={styles.contenu}>
        {parametres?.logo ? (
          <Image source={{ uri: urlMedia(parametres.logo) }} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.logoTexte}>{nomSite}</Text>
        )}
        <Text style={styles.tagline}>{parametres?.description || TAGLINE_DEFAUT}</Text>

        <Bouton variante="principal" taille="lg" style={styles.bouton} onPress={() => navigation.navigate('Decouvrir')}>
          Accéder au service
        </Bouton>
      </SafeAreaView>
    </FondDegradeEcran>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacements[6],
  },
  logo: {
    width: '100%',
    maxWidth: 240,
    height: 100,
    marginBottom: espacements[3],
  },
  logoTexte: {
    fontFamily: polices.titre,
    fontSize: taillesTexte['4xl'],
    color: couleurs.principal,
    marginBottom: espacements[3],
  },
  tagline: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.base,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    marginBottom: espacements[8],
  },
  bouton: {
    width: '100%',
  },
});
