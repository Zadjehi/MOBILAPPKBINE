import { View, Text, StyleSheet } from 'react-native';
import { espacements, rayons, taillesTexte, polices } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Alerte.js + _alertes.scss — couleurs
// exactes reprises du CSS réel (pas une teinte générique dérivée), sans
// icônes SVG ni bouton "fermable" (non utilisés par les 2 écrans v1).
const STYLES_TYPE = {
  info: { fond: '#EFF6FF', bordureGauche: '#3B82F6', texte: '#1E3A5F' },
  succes: { fond: '#F0FDF4', bordureGauche: '#22C55E', texte: '#14532D' },
  avertissement: { fond: '#FFFBEB', bordureGauche: '#F59E0B', texte: '#78350F' },
  erreur: { fond: '#FFF5F5', bordureGauche: '#EF4444', texte: '#7F1D1D' },
};

export default function Alerte({ type = 'info', titre = '', message, style }) {
  const s = STYLES_TYPE[type] || STYLES_TYPE.info;
  return (
    <View style={[styles.base, { backgroundColor: s.fond, borderLeftColor: s.bordureGauche }, style]}>
      {titre ? <Text style={[styles.titre, { color: s.texte }]}>{titre}</Text> : null}
      <Text style={[styles.message, { color: s.texte }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 4,
    borderRadius: rayons.lg,
    padding: espacements[4],
  },
  titre: {
    fontFamily: polices.corpsGras,
    fontSize: taillesTexte.sm,
    marginBottom: espacements[1],
  },
  message: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.sm,
    lineHeight: taillesTexte.sm * 1.5,
    opacity: 0.9,
  },
});
