import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, Linking, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Bouton, Champ, Alerte, Chargeur, Badge } from '../composants/communs';
import apiPublique from '../services/apiPublique';
import { LIBELLES_OPERATEUR, COULEURS_OPERATEUR, LIBELLES_CATEGORIE, LOGOS_OPERATEUR } from '../constantes/operateurs';
import { calculerCommission, formaterFcfa } from '../utils/commande';
import { nettoyerChiffres, numeroValide, trouverIncoherenceOperateur } from '../utils/validation';
import { couleurs, espacements, rayons, taillesTexte, polices } from '../constantes/theme';
import { FondDegradeEcran } from './EspaceClientEcran';

// Port de frontend/src/pages/espace-client/decouvrir.js — même machine à états
// interne (etape/pile) qu'au web, un seul écran, pas de sous-navigation
// routée (voir le plan : évite de réinventer la logique de retour qui
// fonctionne déjà côté web).
const ETAPES_TRANSFERT = ['reseau', 'numero', 'typeService', 'montant', 'recap'];
const ETAPES_FORFAIT = ['reseau', 'numero', 'typeService', 'categorie', 'forfait', 'recap'];

export default function DecouvrirEcran({ navigation }) {
  const [etape, setEtape] = useState('reseau');
  const [pile, setPile] = useState([]);

  const [reseaux, setReseaux] = useState(null);
  const [prefixes, setPrefixes] = useState(null);
  const [chargementInit, setChargementInit] = useState(true);

  const [operateur, setOperateur] = useState('');
  const [numero, setNumero] = useState('');
  const [erreurNumero, setErreurNumero] = useState('');

  const [typeService, setTypeService] = useState('');
  const [montant, setMontant] = useState('');

  const [forfaitsOperateur, setForfaitsOperateur] = useState([]);
  const [chargementForfaits, setChargementForfaits] = useState(false);
  const [categorie, setCategorie] = useState('');
  const [forfaitChoisi, setForfaitChoisi] = useState(null);

  const [chargementPaiement, setChargementPaiement] = useState(false);
  const [erreurPaiement, setErreurPaiement] = useState('');
  const [commandeCreee, setCommandeCreee] = useState(null);
  const [lienPaiementCree, setLienPaiementCree] = useState(null);

  useEffect(() => {
    Promise.all([
      apiPublique.get('/catalogue/reseaux/public'),
      apiPublique.get('/catalogue/prefixes/public'),
    ]).then(([resReseaux, resPrefixes]) => {
      setReseaux(resReseaux.data.donnees?.reseaux || []);
      setPrefixes(resPrefixes.data.donnees?.prefixes || []);
    }).catch(() => { setReseaux([]); setPrefixes([]); })
      .finally(() => setChargementInit(false));
  }, []);

  function aller(etapeSuivante) {
    setPile((p) => [...p, etape]);
    setEtape(etapeSuivante);
  }

  const retour = useCallback(() => {
    setPile((p) => {
      if (p.length === 0) return p;
      const copie = [...p];
      const precedente = copie.pop();
      setEtape(precedente);
      return copie;
    });
  }, []);

  // Bouton retour matériel Android : recule d'une étape comme le bouton à
  // l'écran, ou laisse la navigation par défaut (retour à l'accueil) sur la
  // toute première étape — sans ça, le back Android quitterait directement
  // l'assistant au lieu de suivre le même parcours que le web.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (pile.length === 0) return false;
        retour();
        return true;
      });
      return () => sub.remove();
    }, [pile, retour])
  );

  function choisirReseau(op) {
    setOperateur(op);
    setErreurNumero('');
    aller('numero');
  }

  function validerNumero() {
    const chiffres = nettoyerChiffres(numero);
    if (!numeroValide(chiffres)) {
      setErreurNumero('Le numéro doit contenir 10 chiffres (ex : 07 00 00 00 00).');
      return;
    }
    const incoherence = trouverIncoherenceOperateur(chiffres, operateur, prefixes, LIBELLES_OPERATEUR);
    if (incoherence) {
      setErreurNumero(incoherence);
      return;
    }
    setErreurNumero('');
    aller('typeService');
  }

  function choisirTypeService(type) {
    setTypeService(type);
    if (type === 'transfert') {
      aller('montant');
      return;
    }
    setChargementForfaits(true);
    apiPublique.get('/catalogue/forfaits/public', { params: { operateur } })
      .then(({ data }) => setForfaitsOperateur(data.donnees?.forfaits || []))
      .catch(() => setForfaitsOperateur([]))
      .finally(() => setChargementForfaits(false));
    aller('categorie');
  }

  // PayDunya refuse toute facture sous 200 FCFA (frais inclus) — mieux vaut
  // ne jamais montrer un forfait impossible à payer que laisser le client
  // aller jusqu'au bout du parcours pour rien (voir aussi commandesControleur.
  // creerDirect, même contrôle côté serveur).
  const forfaitsAchetables = useMemo(
    () => forfaitsOperateur.filter((f) => parseFloat(f.prix) + calculerCommission(f.prix) >= 200),
    [forfaitsOperateur]
  );

  const montantTotalInsuffisant = useMemo(() => {
    const m = parseFloat(montant);
    if (!(m > 0)) return false;
    return m + calculerCommission(m) < 200;
  }, [montant]);

  const categoriesDisponibles = useMemo(() => {
    const set = new Set(forfaitsAchetables.map((f) => f.categorie));
    return Array.from(set);
  }, [forfaitsAchetables]);

  const forfaitsCategorie = useMemo(
    () => forfaitsAchetables.filter((f) => f.categorie === categorie),
    [forfaitsAchetables, categorie]
  );

  function choisirCategorie(cat) {
    setCategorie(cat);
    aller('forfait');
  }

  function choisirForfait(f) {
    setForfaitChoisi(f);
    aller('recap');
  }

  function recommencer() {
    setEtape('reseau'); setPile([]);
    setOperateur(''); setNumero(''); setErreurNumero('');
    setTypeService(''); setMontant('');
    setForfaitsOperateur([]); setCategorie(''); setForfaitChoisi(null);
    setChargementPaiement(false); setErreurPaiement(''); setCommandeCreee(null);
    setLienPaiementCree(null);
  }

  // La commande n'est enregistrée (et donc éligible au traitement automatique
  // par le boîtier) qu'à ce moment précis — au clic sur "Payer", pas avant.
  async function payerEtRediriger() {
    setChargementPaiement(true);
    setErreurPaiement('');
    try {
      const { data } = await apiPublique.post('/commandes/directe', {
        numeroTelephone: numero,
        operateur,
        ...(typeService === 'forfait' ? { forfaitId: forfaitChoisi?.id } : { montantCredit: montant }),
      });
      const commande = data.donnees.commande;
      setCommandeCreee(commande);
      const lien = data.donnees.lienPaiement || null;
      setLienPaiementCree(lien);
      if (lien) Linking.openURL(lien);
    } catch (err) {
      setErreurPaiement(err?.response?.data?.message || "Impossible d'enregistrer la commande pour le moment.");
    } finally {
      setChargementPaiement(false);
    }
  }

  const etapesBranche = typeService === 'forfait' ? ETAPES_FORFAIT : ETAPES_TRANSFERT;
  const positionEtape = etapesBranche.indexOf(etape) + 1;
  const montantBase = typeService === 'transfert' ? montant : forfaitChoisi?.prix;

  return (
    <FondDegradeEcran>
      <SafeAreaView style={styles.ecran}>
      <ScrollView contentContainerStyle={styles.scrollContenu}>
      {etape !== 'reseau' && etape !== 'recap' && (
        <Pressable onPress={retour} style={styles.retour}>
          <Text style={styles.retourTexte}>← Retour</Text>
        </Pressable>
      )}
      {etape === 'reseau' && (
        <Pressable onPress={() => navigation.goBack()} style={styles.retour}>
          <Text style={styles.retourTexte}>← Retour</Text>
        </Pressable>
      )}

      {etape !== 'recap' && positionEtape > 0 && (
        <Text style={styles.etapeLabel}>ÉTAPE {positionEtape} / {etapesBranche.length}</Text>
      )}

      {chargementInit ? (
        <Chargeur taille="lg" />
      ) : (
        <>
          {etape === 'reseau' && (
            <>
              <Text style={styles.titre}>Quel réseau ?</Text>
              <Text style={styles.sousTitre}>Choisissez l'opérateur du numéro à recharger.</Text>
              {reseaux.length === 0 ? (
                <Alerte type="avertissement" message="Aucun réseau disponible pour le moment. Réessayez plus tard." />
              ) : (
                <View style={styles.liste}>
                  {reseaux.map((op) => (
                    <Pressable key={op} onPress={() => choisirReseau(op)} style={styles.carte}>
                      {LOGOS_OPERATEUR[op] ? (
                        <Image source={LOGOS_OPERATEUR[op]} style={styles.logoOperateur} />
                      ) : (
                        <View style={[styles.logoOperateur, { backgroundColor: COULEURS_OPERATEUR[op] }]} />
                      )}
                      <Text style={styles.carteTitre}>{LIBELLES_OPERATEUR[op] || op}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}

          {etape === 'numero' && (
            <>
              <Text style={styles.titre}>Votre numéro {LIBELLES_OPERATEUR[operateur]}</Text>
              <Text style={styles.sousTitre}>Le numéro à recharger.</Text>
              {erreurNumero ? <Alerte type="erreur" message={erreurNumero} style={styles.marginBas} /> : null}
              <Champ type="tel" label="Numéro de téléphone" valeur={numero} onChangeText={setNumero} placeholder="07 00 00 00 00" requis />
              <Bouton variante="principal" taille="lg" style={styles.boutonPleine} onPress={validerNumero}>
                Continuer
              </Bouton>
            </>
          )}

          {etape === 'typeService' && (
            <>
              <Text style={styles.titre}>Que voulez-vous faire ?</Text>
              <View style={styles.liste}>
                <Pressable onPress={() => choisirTypeService('transfert')} style={styles.carteTexte}>
                  <Text style={styles.carteTitre}>Transfert direct de crédit</Text>
                  <Text style={styles.carteDescription}>Envoyer un montant libre de crédit.</Text>
                </Pressable>
                <Pressable onPress={() => choisirTypeService('forfait')} style={styles.carteTexte}>
                  <Text style={styles.carteTitre}>Achat d'un forfait</Text>
                  <Text style={styles.carteDescription}>Internet, appel, SMS ou combo.</Text>
                </Pressable>
              </View>
            </>
          )}

          {etape === 'montant' && (
            <>
              <Text style={styles.titre}>Montant à envoyer</Text>
              <Champ type="number" label="Montant (FCFA)" valeur={montant} onChangeText={setMontant} placeholder="1000" requis />
              {montantTotalInsuffisant ? (
                <Alerte
                  type="avertissement"
                  message="Le montant total (frais de service inclus) doit être d'au moins 200 FCFA pour pouvoir être payé en ligne."
                  style={styles.marginHaut}
                />
              ) : null}
              <Bouton
                variante="principal" taille="lg" style={styles.boutonPleine}
                desactive={!montant || parseFloat(montant) <= 0 || montantTotalInsuffisant}
                onPress={() => aller('recap')}
              >
                Continuer
              </Bouton>
            </>
          )}

          {etape === 'categorie' && (
            <>
              <Text style={styles.titre}>Quel type de forfait ?</Text>
              {chargementForfaits ? (
                <Chargeur taille="lg" />
              ) : categoriesDisponibles.length === 0 ? (
                <Alerte type="avertissement" message={`Aucun forfait disponible pour ${LIBELLES_OPERATEUR[operateur]} pour le moment.`} />
              ) : (
                <View style={styles.liste}>
                  {categoriesDisponibles.map((cat) => (
                    <Pressable key={cat} onPress={() => choisirCategorie(cat)} style={styles.carteTexte}>
                      <Text style={styles.carteTitre}>{LIBELLES_CATEGORIE[cat] || cat}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}

          {etape === 'forfait' && (
            <>
              <Text style={styles.titre}>{LIBELLES_CATEGORIE[categorie]} — {LIBELLES_OPERATEUR[operateur]}</Text>
              <View style={styles.liste}>
                {forfaitsCategorie.map((f) => (
                  <Pressable key={f.id} onPress={() => choisirForfait(f)} style={[styles.carteTexte, styles.carteForfait]}>
                    <View style={styles.forfaitInfos}>
                      <Text style={styles.carteTitre}>{f.nom}</Text>
                      {f.description ? <Text style={styles.forfaitDetail}>{f.description}</Text> : null}
                      {f.validite_jours ? (
                        <Text style={styles.forfaitDetailFaible}>Valable {f.validite_jours} jour{f.validite_jours > 1 ? 's' : ''}</Text>
                      ) : null}
                    </View>
                    <Badge variante="principal">{formaterFcfa(f.prix)} FCFA</Badge>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {etape === 'recap' && (
            <>
              <Text style={styles.titre}>Récapitulatif</Text>

              {commandeCreee ? (
                <>
                  <Alerte
                    type="succes"
                    message={`Commande #${commandeCreee.id} enregistrée — vous avez été redirigé vers la page de paiement pour régler ${formaterFcfa(commandeCreee.montant_total)} FCFA.`}
                  />
                  <View style={[styles.carteTexte, styles.marginHaut]}>
                    <View style={styles.ligneInfo}>
                      <Text style={styles.infoCle}>Montant à payer</Text>
                      <Text style={styles.infoVal}>{formaterFcfa(commandeCreee.montant_total)} FCFA</Text>
                    </View>
                  </View>

                  {lienPaiementCree ? (
                    <Text style={styles.notePetite}>
                      La page de paiement ne s'est pas ouverte ?{' '}
                      <Text style={styles.lienTexte} onPress={() => Linking.openURL(lienPaiementCree)}>Appuyez ici</Text>.
                    </Text>
                  ) : (
                    <Alerte type="avertissement" message="Le paiement en ligne n'est pas encore configuré — contactez-nous pour finaliser cette commande." style={styles.marginHaut} />
                  )}

                  <Bouton variante="outline" style={styles.boutonPleineMarge} onPress={recommencer}>
                    Nouvelle demande
                  </Bouton>
                </>
              ) : (
                <>
                  <View style={styles.carteTexte}>
                    <View style={styles.ligneInfo}>
                      <Text style={styles.infoCle}>Réseau</Text>
                      <Text style={styles.infoVal}>{LIBELLES_OPERATEUR[operateur]}</Text>
                    </View>
                    <View style={styles.ligneInfo}>
                      <Text style={styles.infoCle}>Numéro</Text>
                      <Text style={styles.infoVal}>{numero}</Text>
                    </View>
                    {typeService === 'transfert' ? (
                      <View style={styles.ligneInfo}>
                        <Text style={styles.infoCle}>Montant</Text>
                        <Text style={styles.infoVal}>{formaterFcfa(montant || 0)} FCFA</Text>
                      </View>
                    ) : (
                      <>
                        <View style={styles.ligneInfo}>
                          <Text style={styles.infoCle}>Forfait</Text>
                          <Text style={styles.infoVal}>{forfaitChoisi?.nom}</Text>
                        </View>
                        {forfaitChoisi?.description ? (
                          <View style={styles.ligneInfo}>
                            <Text style={styles.infoCle}>Contenu</Text>
                            <Text style={styles.infoVal}>{forfaitChoisi.description}</Text>
                          </View>
                        ) : null}
                        {forfaitChoisi?.validite_jours ? (
                          <View style={styles.ligneInfo}>
                            <Text style={styles.infoCle}>Validité</Text>
                            <Text style={styles.infoVal}>{forfaitChoisi.validite_jours} jour{forfaitChoisi.validite_jours > 1 ? 's' : ''}</Text>
                          </View>
                        ) : null}
                        <View style={styles.ligneInfo}>
                          <Text style={styles.infoCle}>Montant</Text>
                          <Text style={styles.infoVal}>{formaterFcfa(forfaitChoisi?.prix || 0)} FCFA</Text>
                        </View>
                      </>
                    )}
                    <View style={styles.ligneInfo}>
                      <Text style={styles.infoCle}>Frais de service</Text>
                      <Text style={styles.infoVal}>{formaterFcfa(calculerCommission(montantBase))} FCFA</Text>
                    </View>
                    <View style={styles.ligneInfo}>
                      <Text style={[styles.infoCle, styles.gras]}>Total à payer</Text>
                      <Text style={[styles.infoVal, styles.gras]}>
                        {formaterFcfa((parseFloat(montantBase) || 0) + calculerCommission(montantBase))} FCFA
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.notePetite}>Kbine ajoute 2 FCFA + 2,5% du montant en frais de service par opération.</Text>

                  {erreurPaiement ? <Alerte type="erreur" message={erreurPaiement} style={styles.marginHaut} /> : null}

                  <Bouton variante="principal" taille="lg" style={styles.boutonPleine} chargement={chargementPaiement} onPress={payerEtRediriger}>
                    Payer {formaterFcfa((parseFloat(montantBase) || 0) + calculerCommission(montantBase))} FCFA
                  </Bouton>

                  <Bouton variante="outline" style={styles.boutonPleineMarge} onPress={recommencer}>
                    Recommencer
                  </Bouton>
                </>
              )}
            </>
          )}
        </>
      )}
      </ScrollView>
      </SafeAreaView>
    </FondDegradeEcran>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
  },
  scrollContenu: {
    padding: espacements[6],
    paddingBottom: espacements[12],
  },
  retour: {
    marginBottom: espacements[4],
  },
  retourTexte: {
    fontFamily: polices.corps,
    color: couleurs.texteSecondaire,
    fontSize: taillesTexte.sm,
  },
  etapeLabel: {
    fontFamily: polices.corpsGras,
    fontSize: taillesTexte.xs,
    color: couleurs.texteSecondaire,
    marginBottom: espacements[2],
  },
  titre: {
    fontFamily: polices.titre,
    fontSize: taillesTexte['2xl'],
    color: couleurs.principal,
    marginBottom: espacements[1],
  },
  sousTitre: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.sm,
    color: couleurs.texteSecondaire,
    marginBottom: espacements[5],
  },
  liste: {
    gap: espacements[3],
  },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacements[3],
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: rayons.lg,
    padding: espacements[5],
    backgroundColor: couleurs.blanc,
  },
  carteTexte: {
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: rayons.lg,
    padding: espacements[5],
    backgroundColor: couleurs.blanc,
  },
  carteForfait: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacements[3],
  },
  forfaitInfos: {
    flex: 1,
  },
  carteTitre: {
    fontFamily: polices.corpsGras,
    fontSize: taillesTexte.base,
    color: couleurs.texte,
  },
  carteDescription: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.sm,
    color: couleurs.texteSecondaire,
    marginTop: espacements[1],
  },
  forfaitDetail: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.sm,
    color: couleurs.texte,
    marginTop: espacements[1],
  },
  forfaitDetailFaible: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.xs,
    color: couleurs.texteSecondaire,
    marginTop: espacements[1],
  },
  logoOperateur: {
    width: 36,
    height: 36,
    borderRadius: rayons.rond,
  },
  boutonPleine: {
    width: '100%',
    marginTop: espacements[5],
  },
  boutonPleineMarge: {
    width: '100%',
    marginTop: espacements[3],
  },
  marginBas: {
    marginBottom: espacements[4],
  },
  marginHaut: {
    marginTop: espacements[4],
  },
  notePetite: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.xs,
    color: couleurs.texteSecondaire,
    marginTop: espacements[3],
  },
  lienTexte: {
    color: couleurs.principal,
    textDecorationLine: 'underline',
  },
  ligneInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: espacements[2],
    borderBottomWidth: 1,
    borderBottomColor: couleurs.grisClair,
  },
  infoCle: {
    fontFamily: polices.corps,
    fontSize: taillesTexte.sm,
    color: couleurs.texteSecondaire,
  },
  infoVal: {
    fontFamily: polices.corpsGras,
    fontSize: taillesTexte.sm,
    color: couleurs.texte,
  },
  gras: {
    fontFamily: polices.corpsGras,
  },
});
