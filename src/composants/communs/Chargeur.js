import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { couleurs, espacements, taillesTexte, polices } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Chargeur.js + _divers.scss (.chargeur__cercle
// tourne en couleur PRINCIPALE/vert, pas accent/orange — vérifié dans le CSS réel).
export default function Chargeur({ taille = 'md', libelle = 'Chargement…' }) {
  return (
    <View style={styles.conteneur}>
      <ActivityIndicator color={couleurs.principal} size={taille === 'lg' ? 'large' : 'small'} />
      <Text style={styles.texte}>{libelle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espacements[6],
    gap: espacements[2],
  },
  texte: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.sm,
    color: couleurs.texteSecondaire,
  },
});
