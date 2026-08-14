import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

// Même ressort de pression que Bouton.js (voir ce fichier) — réutilisé pour
// les cartes sélectionnables (réseau, type de service, forfait...) dans
// DecouvrirEcran, qui n'avaient jusqu'ici aucun retour visuel à l'appui.
export default function CartePressable({ onPress, style, children }) {
  const echelle = useRef(new Animated.Value(1)).current;
  const appuyer = () => {
    Animated.spring(echelle, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };
  const relacher = () => {
    Animated.spring(echelle, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 9 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: echelle }] }}>
      <Pressable onPress={onPress} onPressIn={appuyer} onPressOut={relacher} style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
