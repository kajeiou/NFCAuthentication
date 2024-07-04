import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import IconEnt from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  const navigateToNfcScreen = () => {
    navigation.navigate('Nfc');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/octicode_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Authentification par NFC</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={navigateToNfcScreen}>
        <View style={styles.buttonContent}>
          <IconEnt name="lock" size={20} color='white' />
          <Text style={styles.buttonText}> Se connecter par NFC</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 220, 
    height: 220,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3b5998',
    padding: 14,
    borderRadius: 10,
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default HomeScreen;
