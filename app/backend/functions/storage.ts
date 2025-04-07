import type { TxekMatch } from "@/type/TxekMatch";
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

function ClearLastGameSettings() : void {
    try {
        AsyncStorage.removeItem('last_match_settings');
    }  catch (e) {
        // error reading value
        throw new Error("Erreur lors de la suppretion des paramètres de la partie (last_match_settings)"); 
    }
}

export { exportLastGameSettings, importLastGameSettings, ClearLastGameSettings }