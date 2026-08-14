import { View, Text, StyleSheet } from 'react-native';
import PuceAnimee from './PuceAnimee';
import { couleurs, espacements, taillesTexte, polices } from '../../constantes/theme';

// Reprend l'illustration héro (PuceAnimee, voir ce fichier) plutôt qu'un
// simple ActivityIndicator système — un chargement Kbine doit évoquer une
// puce qui "prend vie", cohérent avec l'accueil et le parcours d'achat, pas
// un rond générique identique à n'importe quelle autre appli.
export default function Chargeur({ taille = 'md', libelle = 'Chargement…' }) {
  return (
    <View style={styles.conteneur}>
      <PuceAnimee variante="chargement" taille={taille === 'lg' ? 90 : 56} />
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
