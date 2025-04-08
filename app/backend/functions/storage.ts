import type TxekMatch from "@/models/TxekMatch";
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

// TODO: ClearLastGameSettings

export { exportLastGameSettings, importLastGameSettings }