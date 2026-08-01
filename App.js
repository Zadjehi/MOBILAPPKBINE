import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import EspaceClientEcran from './src/ecrans/EspaceClientEcran';
import DecouvrirEcran from './src/ecrans/DecouvrirEcran';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

// Mêmes polices que le web (frontend/src/pages/_document.js) : Playfair
// Display pour les titres, Inter pour le corps de texte.
export default function App() {
  const [policesChargees] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (policesChargees) SplashScreen.hideAsync();
  }, [policesChargees]);

  if (!policesChargees) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName="Accueil" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Accueil" component={EspaceClientEcran} />
          <Stack.Screen name="Decouvrir" component={DecouvrirEcran} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
