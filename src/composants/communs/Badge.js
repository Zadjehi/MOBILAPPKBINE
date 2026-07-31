import { View, Text, StyleSheet } from 'react-native';
import { couleurs, espacements, rayons, taillesTexte } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Badge.js — mêmes props (variante,
// enfants), sans "fermable" (non utilisé par les 2 écrans v1).
const FONDS_VARIANTE = {
  principal: couleurs.accent,
  neutre: couleurs.grisClair,
};

export default function Badge({ variante = 'neutre', children }) {
  const estNeutre = variante === 'neutre';
  return (
    <View style={[styles.base, { backgroundColor: FONDS_VARIANTE[variante] || FONDS_VARIANTE.neutre }]}>
      <Text style={[styles.texte, estNeutre ? { color: couleurs.texte } : { color: couleurs.blanc }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: rayons.rond,
    paddingVertical: espacements[1],
    paddingHorizontal: espacements[3],
    alignSelf: 'flex-start',
  },
  texte: {
    fontSize: taillesTexte.xs,
    fontWeight: '700',
  },
});
