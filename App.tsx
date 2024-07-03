import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import NfcManager, { NfcTech, Ndef, TagEvent } from 'react-native-nfc-manager';

NfcManager.start();

const ErrorScreen = ({ message }: { message: string }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  </SafeAreaView>
);

function App() {
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);
  const [nfcTag, setNfcTag] = useState<TagEvent | null>(null);

  useEffect(() => {
    NfcManager.isSupported()
      .then(supported => {
        setNfcSupported(supported);
        if (supported) {
          NfcManager.isEnabled().then(enabled => {
            setNfcEnabled(enabled);
            console.log("NfcManager is enabled: " + enabled);
          });
        } else {
          console.error("NfcSupported is: " + supported);
        }
      });
  }, []);

  const readNfc = async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();
      console.log(tag);
      setNfcTag(tag);

      Alert.alert('NFC Tag', JSON.stringify(tag));
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  if (!nfcSupported) {
    return <ErrorScreen message="NFC n'est pas supporté sur cet appareil." />;
  }

  if (!nfcEnabled) {
    return <ErrorScreen message="NFC est désactivé. Veuillez l'activer pour continuer." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>NFC Reader</Text>
          <Text style={styles.sectionDescription}>
            Approchez un tag NFC de votre appareil pour lire les données.
          </Text>
          <TouchableOpacity onPress={readNfc} style={styles.button}>
            <Text style={styles.buttonText}>Lire le tag NFC</Text>
          </TouchableOpacity>
          {nfcTag && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagTitle}>Tag NFC détecté :</Text>
              <Text style={styles.tagContent}>{JSON.stringify(nfcTag)}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  tagContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  tagTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagContent: {
    marginTop: 5,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default App;
