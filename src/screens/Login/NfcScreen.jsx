import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import NfcManager, { NfcTech, Ndef  } from 'react-native-nfc-manager';
import { generatePinCode } from '../../utils/Generate';
import UserService from '../../services/UserService';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';
NfcManager.start();

function NfcScreen() {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [nfcTag, setNfcTag] = useState(null);
  const [pinCode, setPinCode] = useState(null);
  const [nfcRequesting, setNfcRequesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleNfcRead = async () => {
    if (nfcRequesting) {
      showErrorAlert("Une recherche NFC est déjà en cours.");
      return;
    }

    setNfcRequesting(true);
    setLoading(true);
    setError(null);

    try {
      const techRequestPromise = NfcManager.requestTechnology(NfcTech.Ndef);
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Délai d'attente dépassé. Aucune carte NFC n'a été détectée.")), 15000);
      });
      
      await Promise.race([techRequestPromise, timeoutPromise]);
      const tag = await NfcManager.getTag();

      if (!tag) {
        throw new Error("Aucune carte NFC détectée.");
      }

      console.log("Carte NFC :", tag);

      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecords = tag.ndefMessage;

        console.log("ici")
        console.log(ndefRecords[0].payload)
        console.log("ici2")

        if (ndefRecords[0].payload) {
          let textPayload;
          
          try {
            textPayload = Ndef.text.decodePayload(ndefRecords[0].payload);
            const pin = generatePinCode();
            setPinCode(pin);
            console.log("PIN généré : " + pin);
            try {
              //await UserService.sendNfcData(textPayload, pin);
              startCountdown();
            } catch (error) {
              showErrorAlert("Erreur lors de l'envoi des données NFC.");
            }

            startCountdown();
          } catch (error) {
            throw new Error("Erreur lors du décodage du payload NFC.");
          }
          console.log("Contenu de la carte NFC :", textPayload);
          Alert.alert('Contenu de la carte NFC', `Contenu du tag : ${textPayload}`);
        } else {
          showErrorAlert("Le décodage de la carte a échoué.");
        }
      } else {
        showErrorAlert("La carte est corrompue.");
      }

      
    } catch (error) {
      console.warn("Erreur lors de la lecture du NFC :", error);
      showErrorAlert(error.message || error);
    } finally {
      setNfcRequesting(false);
      setLoading(false);
      await NfcManager.cancelTechnologyRequest();
    }
  };

  const startCountdown = () => {
    setTimeout(() => {
      setPinCode(null);
    }, 15000);
  };

  const showErrorAlert = (message) => {
    Alert.alert('Erreur NFC', message);
    setError(message);
  };

  if (!nfcSupported) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>NFC n'est pas supporté sur cet appareil.</Text>
      </View>
    );
  }

  if (!nfcEnabled) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>NFC est désactivé. Veuillez l'activer pour continuer.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNfcRead} style={[styles.button, nfcRequesting && styles.disabledButton]}>

        <View style={styles.buttonContent}>
         
          <Text style={styles.buttonText}>Lire la carte NFC </Text>
          <IconMat name="credit-card-lock-outline" size={20} color='white' style={styles.icon} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={loading}
        transparent={true}
        animationType='fade'
        onRequestClose={() => {}}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Prêt à scanner</Text>
            <ActivityIndicator size='large' color='#3b5998' />
            <Text style={styles.modalText}>Tenez la carte NFC de manière stable et suffisamment longtemps proche du portable.</Text>
          </View>
        </View>
      </Modal>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {nfcTag && (
        <View style={styles.tagContainer}>
          {pinCode !== null && (
            <>
              <Text style={styles.tagTitle}>Code PIN :</Text>
              <Text style={styles.pinCode}>{pinCode}</Text>
              
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3b5998',
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
  tagContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
  },
  tagTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagContent: {
    marginTop: 5,
    fontSize: 14,
  },
  pinCode: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default NfcScreen;
