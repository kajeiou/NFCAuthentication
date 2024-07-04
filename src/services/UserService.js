
const API_URL = 'http://example.com/api'; 

const UserService = {
  sendNfcData: async (nfcContent, pin) => {
    const currentDate = new Date();
    const generatedAt = currentDate.toISOString(); 
    try {
      const response = await fetch(`${API_URL}/nfc-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nfcContent,
          pin,
          generatedAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données NFC.');
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Erreur de service UserService :', error.message);
      throw error;
    }
  },
};

export default UserService;
