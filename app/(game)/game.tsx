import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { TxekMatch } from '@/type/TxekMatch';

export default function CountPointsPage() {
  const params = useLocalSearchParams();
  
  // Récupérer et parser les données du match
  let match: TxekMatch | null = null;
  try {
    if (params.matchData) {
      match = JSON.parse(params.matchData as string) as TxekMatch;
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comptage des points</Text>
      <Text>Nombre de manches: {match.roundMax}</Text>
      <Text>Joueurs:</Text>
      {match.players.map((player, index) => (
        <View key={index} style={styles.playerRow}>
          <Text>{player.name} - Points: {player.points}</Text>
          <Pressable 
            style={styles.button}
            onPress={() => {console.log(`Button pressed for ${player.name}`);}}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      ))}
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