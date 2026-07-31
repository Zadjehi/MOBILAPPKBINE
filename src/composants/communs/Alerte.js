import { View, Text, StyleSheet } from 'react-native';
import { couleurs, espacements, rayons, taillesTexte } from '../../constantes/theme';

// Port simplifié de frontend/src/composants/communs/Alerte.js — mêmes props
// (type, titre, message), sans icônes SVG ni bouton "fermable" (non utilisés
// par les 2 écrans v1) : simple bandeau coloré selon le type.
const COULEURS_TYPE = {
  info: couleurs.info,
  succes: couleurs.succes,
  avertissement: couleurs.avertissement,
  erreur: couleurs.erreur,
};

export default function Alerte({ type = 'info', titre = '', message, style }) {
  const couleur = COULEURS_TYPE[type] || COULEURS_TYPE.info;
  return (
    <View style={[styles.base, { borderLeftColor: couleur, backgroundColor: `${couleur}1A` }, style]}>
      {titre ? <Text style={[styles.titre, { color: couleur }]}>{titre}</Text> : null}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 4,
    borderRadius: rayons.sm,
    padding: espacements[4],
  },
  titre: {
    fontSize: taillesTexte.sm,
    fontWeight: '700',
    marginBottom: espacements[1],
  },
  message: {
    fontSize: taillesTexte.sm,
    color: couleurs.texte,
  },
});
