import * as FileSystem from 'expo-file-system';

const apiKey = ""
/**
 * fait un fetch request a l'api de moondream avec le clé d'api
 * 
 * @param base64Photo - Photo encodé en base64
 * @returns Une promise reponse de l'api 
 * @throws si il y a une erreur lors de la requete
 */
const fetchMoondream = async (base64Photo : string) => {
    const endpoint: string = 'detect';
    const base64Image: string = base64Photo
  
    const requestBody: { image_url: string; object: string; stream: boolean } = {
      image_url: `data:image/jpeg;base64,${base64Image}`,
      object: 'computer',
      stream: false, 
    };
  
    try {
      const response = await fetch(`https://api.moondream.ai/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'X-Moondream-Auth': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

/**
 * permet de voir si la photo contient des cartes
 * 
 * @param photoUri - Uri de la photo
 * @returns Une promise reponse de l'api 
 * @throws si il y a une erreur lors de la requete
 */  
const convertUriToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting URI to Base64:', error);
    }
}

async function checkCard(photoUri : string) {
    const base64Image: string | undefined = await convertUriToBase64(photoUri)
    if (base64Image) {
        return await fetchMoondream(base64Image)
    }
    console.error('Failed to convert URI to Base64');
}

export { checkCard, fetchMoondream }