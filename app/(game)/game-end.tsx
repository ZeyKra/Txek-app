import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TxekMatch from '@/models/TxekMatch';;
import TxekButton from '@/components/TxekButton';
import { getStorageToken, getStorageUserData } from '../backend/storage';
import ConnexionModal from '@/components/ConnexionModal';
import { useState } from 'react';
import {registerMatchRounds, registerTxekMatch} from '@/services/api'; // Assurez-vous que le chemin est correct
import { replace } from 'expo-router/build/global-state/routing';

export default function EndGamePage() {
  const params = useLocalSearchParams();
  const parsedMatchData: TxekMatch = JSON.parse(params.matchData as string)
  // Récupérer et parser les données du match
  let match: TxekMatch;
  try {
    if (params.matchData) {
      match = new TxekMatch(parsedMatchData.roundMax);
      Object.assign(match, parsedMatchData);
      //DEBUG
    }
  } catch (error) {
    console.error('Erreur lors du parsing des données du match:', error);
  }

  if (!match) {
    return (
      <View style={styles.container}>
        <Text>Erreur: Données du match non disponibles</Text>
      </View>
    );
  }


  const handleSaveGameButton = async () => {
    const userData = await getStorageUserData();
    const token = await getStorageToken();
    if (!userData || !token) {
      console.error('Utilisateur non connecté ou token manquant');
      setIsModalVisible(true);
      return;
    }
    
    try {
      const response = await registerTxekMatch(match);
      console.log('Partie enregistrée avec succès', response); //DEBUG

      const matchId = (response.id as string).split(':')[1]; // Nettoyer la réponse pour obtenir l'ID du match

      const roundResponse = await registerMatchRounds(match, matchId);
      console.log('Manches enregistrées avec succès', roundResponse); //DEBUG
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la partie:', error);
    } 
  };

  const handleCloseGameButton = () => {
    router.push({
      pathname: '/',
    })
  };


  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ConnexionModal
        setIsVisible={() => setIsModalVisible(!isModalVisible)}
        isVisibile={isModalVisible}
        onCancel={() => { }}
        message="Connexion au compte Txek"
      />
      <Text style={styles.title}>Classement </Text>
      <Text>Nombre de manches: {match.roundMax}</Text>
      <Text>Joueurs:</Text>
      {match.players.map((player, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Index utilisé pour la clé unique
        <View key={index} style={styles.playerRow}>
          <Text>{player.name} - Points: {player.points}</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              console.log(`Button pressed for ${player.name}`);
            }} //DEBUG
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      ))}
      {/* Boutton Manche suivante */}
      <View style={styles.container}>
        <TxekButton
          text="Enregistrer la partie"
          variant="secondary"
          onPress={() => { handleSaveGameButton(); }}
        />
      </View>
      <TxekButton
        text="Fermer"
        variant="primary"
        onPress={() => { handleCloseGameButton(); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  }
});