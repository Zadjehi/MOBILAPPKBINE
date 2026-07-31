import { View, Text, TextInput, StyleSheet } from 'react-native';
import { couleurs, espacements, rayons, taillesTexte } from '../../constantes/theme';

// Port de frontend/src/composants/communs/Champ.js — mêmes noms de props côté
// appelant (valeur, label, requis, desactive, erreur, aide), sauf onChange qui
// devient onChangeText (TextInput RN renvoie directement la chaîne, pas un
// événement) : chaque appel `onChange={e => setX(e.target.value)}` du web
// devient `onChangeText={setX}` ici.
const CLAVIERS = {
  tel: 'phone-pad',
  number: 'numeric',
};

export default function Champ({
  type = 'text',
  valeur = '',
  onChangeText,
  label,
  placeholder = '',
  requis = false,
  desactive = false,
  erreur = '',
  aide = '',
}) {
  return (
    <View style={styles.groupe}>
      {label && (
        <Text style={styles.label}>
          {label}
          {requis ? ' *' : ''}
        </Text>
      )}
      <TextInput
        value={valeur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={couleurs.texteSecondaire}
        editable={!desactive}
        keyboardType={CLAVIERS[type] || 'default'}
        style={[styles.champ, erreur && styles.champErreur, desactive && styles.champDesactive]}
      />
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : aide ? <Text style={styles.aide}>{aide}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  groupe: {
    marginBottom: espacements[2],
  },
  label: {
    fontSize: taillesTexte.sm,
    fontWeight: '600',
    color: couleurs.texte,
    marginBottom: espacements[2],
  },
  champ: {
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: rayons.md,
    paddingVertical: espacements[3],
    paddingHorizontal: espacements[4],
    fontSize: taillesTexte.base,
    color: couleurs.texte,
    backgroundColor: couleurs.blanc,
  },
  champErreur: {
    borderColor: couleurs.erreur,
  },
  champDesactive: {
    backgroundColor: couleurs.grisClair,
  },
  erreur: {
    marginTop: espacements[1],
    fontSize: taillesTexte.xs,
    color: couleurs.erreur,
  },
  aide: {
    marginTop: espacements[1],
    fontSize: taillesTexte.xs,
    color: couleurs.texteSecondaire,
  },
});
