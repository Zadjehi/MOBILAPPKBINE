import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { couleurs, rayons, taillesTexte, espacements } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Bouton.js — mêmes noms de props
// (variante, taille, chargement, desactive, onPress à la place de onClick),
// sans la branche href/Link (aucun des 2 écrans v1 ne l'utilise).
const FONDS_VARIANTE = {
  principal: couleurs.accent,
  secondaire: couleurs.secondaire,
  danger: couleurs.erreur,
};

export default function Bouton({
  variante = 'principal',
  taille = 'md',
  chargement = false,
  desactive = false,
  onPress,
  style,
  children,
}) {
  const estOutline = variante === 'outline';
  const inactif = desactive || chargement;

  return (
    <Pressable
      onPress={inactif ? undefined : onPress}
      disabled={inactif}
      style={({ pressed }) => [
        styles.base,
        taille === 'lg' && styles.tailleLg,
        estOutline ? styles.outline : { backgroundColor: FONDS_VARIANTE[variante] || couleurs.accent },
        inactif && styles.desactive,
        pressed && !inactif && styles.pressed,
        style,
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={estOutline ? couleurs.accent : couleurs.blanc} size="small" />
      ) : (
        <Text style={[styles.texte, estOutline && styles.texteOutline]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: rayons.md,
    paddingVertical: espacements[3],
    paddingHorizontal: espacements[5],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  tailleLg: {
    paddingVertical: espacements[4],
    minHeight: 52,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  desactive: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  texte: {
    color: couleurs.blanc,
    fontSize: taillesTexte.base,
    fontWeight: '600',
  },
  texteOutline: {
    color: couleurs.texte,
  },
});
