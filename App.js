import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EspaceClientEcran from './src/ecrans/EspaceClientEcran';
import DecouvrirEcran from './src/ecrans/DecouvrirEcran';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Accueil" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Accueil" component={EspaceClientEcran} />
        <Stack.Screen name="Decouvrir" component={DecouvrirEcran} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
