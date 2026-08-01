import { View, Text, StyleSheet } from 'react-native';
import { espacements, rayons, taillesTexte, polices } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Badge.js + _badges.scss — vérifié
// dans le CSS réel : "principal" est un fond TEINTÉ clair (pas un aplat
// orange) avec texte et bordure de la même couleur PRINCIPALE (vert).
const STYLES_VARIANTE = {
  principal: { fond: 'rgba(15, 122, 61, 0.08)', texte: '#0F7A3D', bordure: 'rgba(15, 122, 61, 0.18)' },
  neutre: { fond: '#F1F5F9', texte: '#475569', bordure: '#E2E8F0' },
};

export default function Badge({ variante = 'neutre', children }) {
  const s = STYLES_VARIANTE[variante] || STYLES_VARIANTE.neutre;
  return (
    <View style={[styles.base, { backgroundColor: s.fond, borderColor: s.bordure }]}>
      <Text style={[styles.texte, { color: s.texte }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: rayons.rond,
    paddingVertical: 3,
    paddingHorizontal: espacements[3],
    alignSelf: 'flex-start',
  },
  texte: {
    fontFamily: polices.corpsGras,
    fontSize: taillesTexte.xs,
    letterSpacing: 0.3,
  },
});
