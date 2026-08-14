import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Line, G, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';
import { couleurs } from '../../constantes/theme';

// Illustration animée d'une puce SIM — objet "héro" de l'appli mobile,
// équivalent Kbine de la voiture animée sur le site de référence cité par
// l'utilisateur (terminal-industries.com) : un objet qui représente
// concrètement ce que fait le service (recharger une puce), pas juste une
// décoration.
//   - variante="hero"        : boucle d'ambiance (flotte + respire) —
//     disponible mais plus utilisée sur l'accueil (faisait doublon avec le
//     vrai logo Kbine, voir EspaceClientEcran — retiré le 14/08/2026).
//   - variante="progression" : suit une étape précise du parcours d'achat
//     (etape/total) — se remplit au fur et à mesure, bascule en "succès"
//     (coche + halo) sur la dernière étape. Voir DecouvrirEcran.
//   - variante="chargement"  : la puce se remplit et se vide en boucle
//     automatique (pas pilotée par etape/total, contrairement à
//     "progression") — remplace l'ActivityIndicator générique de Chargeur.js.
//
// Construite en SVG pur (react-native-svg) plutôt qu'en Views empilées : la
// silhouette réelle d'une puce SIM (un coin coupé en diagonal, pas juste des
// coins arrondis) n'est pas faisable proprement avec les seuls angles de
// bordure de React Native.
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedG = Animated.createAnimatedComponent(G);

const LARGEUR = 100;
const HAUTEUR = 130;
const RAYON = 14;
// Silhouette réelle d'une puce SIM : coin haut-droit coupé en diagonal, les
// 3 autres arrondis. Tracé une fois, réutilisé pour le contour ET le clip du
// remplissage (voir <ClipPath>) — la forme doit rester identique aux deux
// endroits, sinon le remplissage déborderait visuellement du contour.
const CONTOUR_PUCE = `
  M ${RAYON} 0
  L ${LARGEUR - 26} 0
  L ${LARGEUR} 26
  L ${LARGEUR} ${HAUTEUR - RAYON}
  A ${RAYON} ${RAYON} 0 0 1 ${LARGEUR - RAYON} ${HAUTEUR}
  L ${RAYON} ${HAUTEUR}
  A ${RAYON} ${RAYON} 0 0 1 0 ${HAUTEUR - RAYON}
  L 0 ${RAYON}
  A ${RAYON} ${RAYON} 0 0 1 ${RAYON} 0
  Z
`;

export default function PuceAnimee({
  variante = 'hero',
  etape = 0,
  total = 1,
  taille = 140,
  style,
}) {
  const flotte = useRef(new Animated.Value(0)).current;
  const respire = useRef(new Animated.Value(0)).current;
  const remplissage = useRef(new Animated.Value(0)).current;
  const succes = useRef(new Animated.Value(0)).current;

  // Boucle d'ambiance : flottement vertical léger + respiration d'échelle,
  // continue tant que le composant est monté — c'est elle qui donne
  // l'impression "vivante" demandée, pas une simple icône statique.
  useEffect(() => {
    const boucleFlotte = Animated.loop(
      Animated.sequence([
        Animated.timing(flotte, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(flotte, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    const boucleRespire = Animated.loop(
      Animated.sequence([
        Animated.timing(respire, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(respire, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );
    boucleFlotte.start();
    boucleRespire.start();
    return () => {
      boucleFlotte.stop();
      boucleRespire.stop();
    };
  }, [flotte, respire]);

  // Progression réelle du parcours d'achat — la puce se "recharge"
  // visuellement au même rythme que le client avance dans les étapes.
  useEffect(() => {
    if (variante !== 'progression') return;
    const ratio = total > 0 ? Math.min(etape / total, 1) : 0;
    Animated.timing(remplissage, {
      toValue: ratio,
      duration: 600,
      useNativeDriver: false, // hauteur/position SVG : pas de pilotage natif possible ici
    }).start();
    if (ratio >= 1) {
      Animated.spring(succes, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    } else {
      succes.setValue(0);
    }
  }, [variante, etape, total, remplissage, succes]);

  // Chargement générique : la puce se remplit puis se vide en boucle, sans
  // lien avec une vraie progression — juste un signe de vie pendant l'attente.
  useEffect(() => {
    if (variante !== 'chargement') return;
    const boucle = Animated.loop(
      Animated.sequence([
        Animated.timing(remplissage, { toValue: 1, duration: 1100, useNativeDriver: false }),
        Animated.timing(remplissage, { toValue: 0, duration: 500, useNativeDriver: false }),
      ])
    );
    boucle.start();
    return () => boucle.stop();
  }, [variante, remplissage]);

  const translateY = flotte.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const scaleRespire = respire.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const hauteurRemplie = remplissage.interpolate({ inputRange: [0, 1], outputRange: [0, HAUTEUR] });
  const yRemplie = remplissage.interpolate({ inputRange: [0, 1], outputRange: [HAUTEUR, 0] });

  return (
    <Animated.View
      style={[
        styles.conteneur,
        { width: taille, height: (taille * HAUTEUR) / LARGEUR },
        { transform: [{ translateY: variante === 'hero' ? translateY : 0 }, { scale: variante === 'hero' ? scaleRespire : 1 }] },
        style,
      ]}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}>
        <Defs>
          <LinearGradient id="degradePuce" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={couleurs.principal} />
            <Stop offset="1" stopColor={couleurs.accent} />
          </LinearGradient>
          <LinearGradient id="degradePuceInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={couleurs.bordure} />
            <Stop offset="1" stopColor={couleurs.grisClair} />
          </LinearGradient>
          <LinearGradient id="degradeChip" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#F3D27A" />
            <Stop offset="1" stopColor="#C9A24B" />
          </LinearGradient>
          <ClipPath id="clipPuce">
            <Path d={CONTOUR_PUCE} />
          </ClipPath>
        </Defs>

        {/* Fond de la puce : plein pour "hero", grisé pour "progression"/"chargement"
            (le remplissage animé prend le relais par-dessus, voir juste en-dessous) */}
        <Path
          d={CONTOUR_PUCE}
          fill={variante === 'hero' ? 'url(#degradePuce)' : 'url(#degradePuceInactive)'}
        />

        {(variante === 'progression' || variante === 'chargement') && (
          <AnimatedRect x={0} y={yRemplie} width={LARGEUR} height={hauteurRemplie} fill="url(#degradePuce)" clipPath="url(#clipPuce)" />
        )}

        {/* Puce à contacts (le petit rectangle doré typique d'une carte SIM) */}
        <Rect x={16} y={34} width={42} height={30} rx={5} fill="url(#degradeChip)" opacity={0.95} />
        <Line x1={16} y1={44} x2={58} y2={44} stroke="#8A6D2E" strokeWidth={1} opacity={0.6} />
        <Line x1={16} y1={54} x2={58} y2={54} stroke="#8A6D2E" strokeWidth={1} opacity={0.6} />
        <Line x1={37} y1={34} x2={37} y2={64} stroke="#8A6D2E" strokeWidth={1} opacity={0.6} />

        {/* Coche de succès — n'apparaît qu'à la toute dernière étape. Groupe SVG
            animé (pas une View/Svg imbriquée : invalide dans l'arbre react-native-svg,
            les enfants d'un <Svg> doivent tous être des éléments SVG). */}
        {variante === 'progression' && (
          <AnimatedG
            opacity={succes}
            transform={succes.interpolate({
              inputRange: [0, 1],
              outputRange: [`translate(${LARGEUR / 2}, ${HAUTEUR / 2}) scale(0.5) translate(${-LARGEUR / 2}, ${-HAUTEUR / 2})`, `translate(${LARGEUR / 2}, ${HAUTEUR / 2}) scale(1) translate(${-LARGEUR / 2}, ${-HAUTEUR / 2})`],
            })}
          >
            <Rect x={2} y={2} width={LARGEUR - 4} height={HAUTEUR - 4} rx={RAYON} fill={couleurs.succes} opacity={0.18} />
            <Path
              d="M 32 66 L 46 80 L 74 48"
              stroke={couleurs.succes}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </AnimatedG>
        )}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
