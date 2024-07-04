import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import NfcScreen from '../screens/Login/NfcScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil', headerShown: false }} />
        <Stack.Screen name="Nfc" component={NfcScreen} options={{ title: 'Authentification NFC' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
