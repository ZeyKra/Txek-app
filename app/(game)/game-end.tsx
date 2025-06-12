import { Text, StyleSheet, Pressable, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Dimensions } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import TxekMatch from '@/models/TxekMatch';;
import TxekButton from '@/components/TxekButton';
import { getStorageToken, getStorageUserData } from '../backend/storage';
import ConnexionModal from '@/components/ConnexionModal';
import { useState } from 'react';
import { registerMatchRounds, registerTxekMatch } from '@/services/api'; // Assurez-vous que le chemin est correct
import { TxekPlayer } from '@/types/TxekPlayer';

const { width, height } = Dimensions.get('window');

// Sample match data structure

const WhiteEndgamePage = () => {
  const params = useLocalSearchParams();
  const parsedMatchData: TxekMatch = JSON.parse(params.matchData as string)
  // Récupérer et parser les données du match
  let match: TxekMatch | undefined;
  try {
    if (params.matchData) {
      match = new TxekMatch(parsedMatchData.roundMax);
      Object.assign(match, parsedMatchData);
      //DEBUG
    }
  } catch (error) {
    console.error('Erreur lors du parsing des données du match:', error);
  }

  const matchData = match as TxekMatch // Utiliser les données de match ou les données d'exemple

  // Caculer le top 3 des joueurs
  const getTopPlayers = (players: TxekPlayer[]) => {
    const sortedPlayers = [...players].sort((a, b) => a.points - b.points);
    return sortedPlayers.slice(0, 3).map((player, index) => ({
      ...player,
      rank: index + 1,
      emoji: index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'
    }));
  };

  const setWinner = (players: TxekPlayer[]) => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    if (match) {
      match.winner = sortedPlayers[0]; // Le joueur avec le plus de points
    }
  };

  setWinner(matchData.players); 
  const topPlayers = getTopPlayers(matchData.players);
  const [first, second, third] = topPlayers;

  // Get subtle background colors for ranking
  const getBackgroundColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      1: '#FFFBF0', // Warm white for gold
      2: '#F8F9FA', // Cool white for silver
      3: '#FFF8F0', // Neutral warm white for bronze
    };
    return colors[rank];
  };

  // Get border colors for ranking
  const getBorderColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      1: '#F4D03F', // Subtle gold
      2: '#D5D8DC', // Subtle silver
      3: '#E8DAEF', // Subtle bronze/purple
    };
    return colors[rank];
  };

  // Get accent colors
  const getAccentColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      1: '#F39C12', // Gold accent
      2: '#85929E', // Silver accent
      3: '#A569BD', // Bronze accent
    };
    return colors[rank];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



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
      // Définir le gagnant avant l'enregistrement
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

  // Player card component
  const PlayerCard = ({ player, isWinner = false }) => {
    const cardWidth = isWinner ? width * 0.75 : player.rank === 2 ? width * 0.8 : width * 0.85;
    const cardHeight = isWinner ? 140 : player.rank === 2 ? 120 : 100;

    return (
      <View style={[
        styles.playerCard,
        {
          width: cardWidth,
          height: cardHeight,
          backgroundColor: getBackgroundColor(player.rank),
          borderColor: getBorderColor(player.rank),
          marginBottom: player.rank === 1 ? 24 : 16,
          transform: [{ scale: isWinner ? 1.02 : 1 }],
        }
      ]}>
        <View style={[styles.rankIndicator, { backgroundColor: getAccentColor(player.rank) }]} />

        <View style={styles.rankBadge}>
          <Text style={styles.rankEmoji}>{player.emoji}</Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={[
            styles.playerName,
            isWinner && styles.winnerName,
            { color: getAccentColor(player.rank) }
          ]}>
            {player.name}
          </Text>
          <Text style={[styles.playerPoints, isWinner && styles.winnerPoints]}>
            {player.points} points
          </Text>
          <Text style={styles.rankText}>
            {player.rank === 1 ? '1ère Place' : player.rank === 2 ? '2ème Place' : '3ème Place'}
          </Text>
        </View>
      </View>
    );
  };

  // Minimal podium component
  const MinimalPodium = () => (
    <View style={styles.podiumContainer}>
      {/* Second place (left) */}
      {second && (
        <View style={styles.podiumStep}>
          <View style={[
            styles.podiumBlock,
            {
              backgroundColor: getBackgroundColor(2),
              borderColor: getBorderColor(2),
              height: 60
            }
          ]}>
            <Text style={[styles.podiumRank, { color: getAccentColor(2) }]}>2</Text>
          </View>
        </View>
      )}

      {/* First place (center) */}
      {first && (
        <View style={styles.podiumStep}>
          <View style={[
            styles.podiumBlock,
            {
              backgroundColor: getBackgroundColor(1),
              borderColor: getBorderColor(1),
              height: 80
            }
          ]}>
            <Text style={[styles.podiumRank, { color: getAccentColor(1) }]}>1</Text>
          </View>
        </View>
      )}

      {/* Third place (right) */}
      {third && (
        <View style={styles.podiumStep}>
          <View style={[
            styles.podiumBlock,
            {
              backgroundColor: getBackgroundColor(3),
              borderColor: getBorderColor(3),
              height: 40
            }
          ]}>
            <Text style={[styles.podiumRank, { color: getAccentColor(3) }]}>3</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ConnexionModal
          setIsVisible={() => setIsModalVisible(!isModalVisible)}
          isVisibile={isModalVisible}
          onCancel={() => { }}
          message="Connexion au compte Txek"
        />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Game Complete</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            {formatDate(matchData.createdAt)}
          </Text>
          <Text style={styles.roundInfo}>
            {matchData.currentRound} rounds jouées
          </Text>
        </View>

        {/* Winner Announcement */}
        {first && (
          <View style={styles.winnerAnnouncement}>
            <Text style={styles.winnerEmoji}>👑</Text>
            <Text style={styles.winnerTitle}>Gagnant</Text>
            <Text style={styles.winnerName}>{first.name}</Text>
            <Text style={styles.winnerScore}>{first.points} points</Text>
          </View>
        )}

        {/* Minimal Podium */}
        <MinimalPodium />

        {/* Top 3 Players Cards */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Poduim</Text>

          {/* First Place - Most Prominent */}
          {first && (
            <View style={styles.playerContainer}>
              <PlayerCard player={first} isWinner={true} />
            </View>
          )}

          {/* Second Place - Wider than first */}
          {second && (
            <View style={styles.playerContainer}>
              <PlayerCard player={second} />
            </View>
          )}

          {/* Third Place - Widest */}
          {third && (
            <View style={styles.playerContainer}>
              <PlayerCard player={third} />
            </View>
          )}
        </View>

        {/* All Players Summary */}
        <View style={styles.allPlayersSection}>
          <Text style={styles.sectionTitle}>Résultats Finaux</Text>
          <View style={styles.standingsContainer}>
            {matchData.players
              .sort((a, b) => a.points - b.points)
              .map((player, index) => (
                <View key={player.name} style={[
                  styles.playerRow,
                  index < 3 && { backgroundColor: getBackgroundColor(index + 1) }
                ]}>
                  <View style={styles.playerRankContainer}>
                    <Text style={[
                      styles.playerRowRank,
                      index < 3 && { color: getAccentColor(index + 1) }
                    ]}>
                      {index + 1}
                    </Text>
                    <Text style={styles.playerRowEmoji}>
                      {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                    </Text>
                  </View>
                  <Text style={styles.playerRowName}>{player.name}</Text>
                  <Text style={[
                    styles.playerRowPoints,
                    index < 3 && { color: getAccentColor(index + 1) }
                  ]}>
                    {player.points}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2C3E50',
    letterSpacing: 1,
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 8,
    fontWeight: '400',
  },
  roundInfo: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '300',
  },
  winnerAnnouncement: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  winnerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  winnerTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#7F8C8D',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F39C12',
    marginBottom: 4,
  },
  winnerScore: {
    fontSize: 16,
    color: '#95A5A6',
    fontWeight: '300',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 30,
    paddingHorizontal: 40,
  },
  podiumStep: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  podiumBlock: {
    width: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  podiumRank: {
    fontSize: 20,
    fontWeight: '600',
  },
  playersSection: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  playerContainer: {
    alignItems: 'center',
  },
  playerCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  rankIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  rankEmoji: {
    fontSize: 24,
  },
  playerInfo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  winnerName: {
    fontSize: 24,
  },
  playerPoints: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7F8C8D',
    marginBottom: 4,
  },
  winnerPoints: {
    fontSize: 18,
    color: '#5D6D7E',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#95A5A6',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  allPlayersSection: {
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  standingsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 4,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  playerRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  playerRowRank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
    width: 20,
  },
  playerRowEmoji: {
    fontSize: 16,
  },
  playerRowName: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '400',
    marginLeft: 12,
  },
  playerRowPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D6D7E',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#2C3E50',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
});

export default WhiteEndgamePage;

/*
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
*/