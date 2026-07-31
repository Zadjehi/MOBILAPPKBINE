import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Bouton, Chargeur } from '../composants/communs';
import apiPublique from '../services/apiPublique';
import { urlMedia } from '../utils/urlMedia';
import { couleurs, espacements, taillesTexte } from '../constantes/theme';

// Port de frontend/src/pages/espace-client/index.js — écran d'accueil, fetch
// /parametres/public pour le nom/logo/description du site, un seul bouton
// vers l'écran Découvrir (pas d'inscription/connexion, pareil que le web
// actuellement : masquées en attendant que ce parcours soit prêt).
const TAGLINE_DEFAUT = 'Rechargez votre crédit Orange, Moov ou MTN à distance, payé via Wave ou Mobile Money.';

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
      <SafeAreaView style={styles.ecran}>
        <View style={styles.centre}>
          <Chargeur taille="lg" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.ecran}>
      <View style={styles.contenu}>
        {parametres?.logo ? (
          <Image source={{ uri: urlMedia(parametres.logo) }} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.logoTexte}>{nomSite}</Text>
        )}
        <Text style={styles.tagline}>{parametres?.description || TAGLINE_DEFAUT}</Text>

        <Bouton variante="principal" taille="lg" style={styles.bouton} onPress={() => navigation.navigate('Decouvrir')}>
          Accéder au service
        </Bouton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.fond,
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
    fontSize: taillesTexte['3xl'],
    fontWeight: '700',
    color: couleurs.principal,
    marginBottom: espacements[3],
  },
  tagline: {
    fontSize: taillesTexte.base,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    marginBottom: espacements[8],
  },
  bouton: {
    width: '100%',
  },
});
