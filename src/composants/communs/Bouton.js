import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { couleurs, rayons, taillesTexte, espacements, polices } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Bouton.js + frontend/src/styles/composants/_boutons.scss
// (classe .btn--principal/.btn--outline) — mêmes noms de props (variante,
// taille, chargement, desactive, onPress à la place de onClick).
//
// Important, vérifié dans le CSS réel (pas deviné) : .btn--principal a un
// fond ACCENT (orange) mais un TEXTE PRINCIPAL (vert) — pas de texte blanc.
// .btn--outline a une bordure ET un texte PRINCIPAL (vert), pas gris.
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
  const estDanger = variante === 'danger';
  const inactif = desactive || chargement;

  const fond = estOutline ? 'transparent' : estDanger ? couleurs.secondaire : couleurs.accent;
  const texte = estOutline || !estDanger ? couleurs.principal : couleurs.blanc;

  return (
    <Pressable
      onPress={inactif ? undefined : onPress}
      disabled={inactif}
      style={({ pressed }) => [
        styles.base,
        taille === 'lg' && styles.tailleLg,
        { backgroundColor: fond },
        estOutline && { borderWidth: 2, borderColor: couleurs.principal },
        inactif && styles.desactive,
        pressed && !inactif && styles.pressed,
        style,
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={texte} size="small" />
      ) : (
        <Text style={[styles.texte, { color: texte }]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: rayons.md,
    paddingVertical: espacements[3],
    paddingHorizontal: espacements[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  tailleLg: {
    borderRadius: rayons.lg,
    paddingVertical: espacements[4],
    paddingHorizontal: espacements[8],
    minHeight: 52,
  },
  desactive: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.85,
  },
  texte: {
    fontFamily: polices.corpsGras,
    fontSize: taillesTexte.sm,
    letterSpacing: 0.3,
  },
});
