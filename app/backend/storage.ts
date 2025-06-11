import type TxekMatch from "@/models/TxekMatch";
import type { UserData } from "@/services/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

function exportLastGameSettings(match: TxekMatch) {    
    try {   
        AsyncStorage.setItem('last_match_settings', JSON.stringify(match));
    } catch (e) {
        // saving error
        throw new Error("Erreur lors de l'enregistrement des paramètres de la partie");
    }
}

async function importLastGameSettings() : Promise<TxekMatch | undefined>  {
    try {
        const lastMatchSettings = await AsyncStorage.getItem('last_match_settings');
        if (lastMatchSettings !== null) {
            return JSON.parse(lastMatchSettings) as TxekMatch;
        } 
    }  catch (e) {
        // error reading value
        throw new Error("Erreur lors de la récupération des paramètres de la partie");
    }
}

function setStorageToken(token: string) {    
    try {   
        AsyncStorage.setItem('user_token', token);
    } catch (e) {
        // saving error
        throw new Error("Erreur lors de l'enregistrement du token");
    }
}

async function getStorageToken() : Promise<string | undefined>  {
    try {
        const storageToken = await AsyncStorage.getItem('user_token');
        if (storageToken !== null) {
            return storageToken;
        } 
    }  catch (e) {
        // error reading value
        throw new Error("Erreur lors de la récupération du token en cache");
    }
}

function setStorageUserData(userData: UserData) {    
    try {   
        AsyncStorage.setItem('user_token', JSON.stringify(userData));
    } catch (e) {
        // saving error
        throw new Error("Erreur lors de l'enregistrement des UserData");
    }
}

async function getStorageUserData() : Promise<UserData | undefined>  {
    try {
        const storageUserData = await AsyncStorage.getItem('user_token');
        if (storageUserData !== null) {
            return JSON.parse(storageUserData) as UserData;
        } 
    }  catch (e) {
        // error reading value
        throw new Error("Erreur lors de la récupération des UserData en cache");
    }
}



// TODO: ClearLastGameSettings

export { exportLastGameSettings, importLastGameSettings, setStorageToken, getStorageToken }