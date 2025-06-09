import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TxekMatch from '@/models/TxekMatch';
import type { TxekPlayer } from '@/types/TxekPlayer';
import type { TxekRound } from '@/types/TxekRound';
import TxekButton from '@/components/TxekButton';

export default function CountPointsPage() {
  const params = useLocalSearchParams();
  const parsedMatchData: TxekMatch = JSON.parse(params.matchData as string)
  let currentRound: TxekRound;
  // Récupérer et parser les données du match
  let match: TxekMatch;
  try {
    if (params.matchData) {
      match = new TxekMatch(parsedMatchData.roundMax);
      Object.assign(match, parsedMatchData);
      currentRound = match.getCurrentRound();
      //DEBUG
      console.log('Match récupéré:', match);
      console.log('Round récupéré:', currentRound);
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

  const handleCountPointsButton = (player: TxekPlayer, match: TxekMatch) => {
    // TODO: Logique pour le comptage des points
    
    router.push({
      pathname: '/(game)/count-points',
      params: { matchData: JSON.stringify(match), player: JSON.stringify(player) }, 
    })
  };

  const handleNextRoundButton = () => {
    match.createNewRound();

    router.push({
      pathname: '/(game)/game',
      params: { matchData: JSON.stringify(match) },
    })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round {match.getCurrentRoundIndex() + 1} </Text>
      <Text>Nombre de manches: {match.roundMax}</Text>
      <Text>Joueurs:</Text>
      {match.players.map((player, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Index utilisé pour la clé unique
        <View key={index} style={styles.playerRow}>
          <Text>{player.name} - Points: {player.points} - Deck: {currentRound[player.name]}</Text>
          <Pressable 
            style={styles.button}
            onPress={() => {
              console.log(`Button pressed for ${player.name}`);
              handleCountPointsButton(player, match);
            }} //DEBUG
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      ))}
      <TxekButton 
        text="Manche suivante"
        variant="primary"
        onPress={ () => { handleNextRoundButton(); }} 
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