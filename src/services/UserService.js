import axios from 'axios';

const API_URL = 'http://192.168.1.178:5000';

const UserService = {
  sendNfcData: async (nfcContent, pin) => {
    const currentDate = new Date();
    const generatedAt = currentDate.toISOString(); 
    
    const payload = {
      nfcContent,
      pin,
      generatedAt
    };

    try {
      const response = await axios.post(`${API_URL}/nfc_login`, payload);
      console.log("Response from server:", response.data); 
      return response.data; 
    } catch (error) {
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error("Error sending NFC data:", error.response.data); 
        throw new Error(error.response.data.message || "Erreur lors de l'envoi des données NFC.");
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error("No response received:", error.request);
        throw new Error("Aucune réponse reçue du serveur.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error("Error setting up the request:", error.message);
        throw new Error("Erreur lors de la configuration de la requête.");
      }
    }
  },
};

export default UserService;
