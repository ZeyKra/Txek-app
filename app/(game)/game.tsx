import { View, Text, StyleSheet } from 'react-native';
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
        <Text key={index}>{player.name} - Points: {player.points}</Text>
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
});