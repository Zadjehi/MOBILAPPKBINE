import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { couleurs, espacements, taillesTexte } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Chargeur.js — mêmes props (taille,
// libelle), enveloppe un ActivityIndicator natif.
export default function Chargeur({ taille = 'md', libelle = 'Chargement…' }) {
  return (
    <View style={styles.conteneur}>
      <ActivityIndicator color={couleurs.accent} size={taille === 'lg' ? 'large' : 'small'} />
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
    fontSize: taillesTexte.sm,
    color: couleurs.texteSecondaire,
  },
});
