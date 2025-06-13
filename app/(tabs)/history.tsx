import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { FetchAPIMatch, fetchAPIMatchRounds } from '@/services/api';
const { width } = Dimensions.get('window');

// API configuration - replace with your actual API endpoints when ready

// Placeholder data matching your API structure

const PlaceholderCardGameHistoryTab = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roundsLoading, setRoundsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [roundSlideAnim] = useState(new Animated.Value(0));

  // Simulated API call for matches
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await FetchAPIMatch();
      setMatches(data);
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
      Alert.alert('Erreur', 'Échec du chargement des matchs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Simulated API call for rounds
  const fetchRounds = async (matchId) => {
    try {
      setRoundsLoading(true);

      // Real API call
      const cleanedMatchId = matchId.split(':')[1]; // Clean the match ID if necessary
      const data = await fetchAPIMatchRounds(cleanedMatchId);
      setRounds(data);
      
    } catch (error) {
      console.error('Erreur lors du chargement des rounds:', error);
      Alert.alert('Erreur', 'Échec du chargement des données de round. Veuillez réessayer.');
    } finally {
      setRoundsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchMatches();
  }, []);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Calculate game duration
  const calculateGameDuration = (start: string, end: string) => {
    if (!start || !end) return 'N/A';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: '#28a745',
      in_progress: '#ffc107',
      cancelled: '#dc3545',
      pending: '#6c757d',
    };
    return colors[status.toLowerCase()] || '#6c757d';
  };

  // Get status text
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      completed: 'Terminé',
      in_progress: 'En cours',
      cancelled: 'Annulé',
      pending: 'En attente',
    };
    return statusMap[status.toLowerCase()] || status.toUpperCase();
  };

  // Handle match selection
  const handleMatchPress = async (match) => {
    setSelectedMatch(match); // Debugging log
    await fetchRounds(match.id);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Handle round selection
  const handleRoundPress = (round) => {
    setSelectedRound(round);
    Animated.timing(roundSlideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Handle back navigation
  const handleBackPress = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMatch(null);
      setRounds([]);
    });
  };

  const handleRoundBackPress = () => {
    Animated.timing(roundSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedRound(null);
    });
  };

  // Extract player cards from round data
  const getPlayerCards = (round) => {
    const playerCards = {};
    const excludedKeys = ['created_at', 'id', 'round_index', 'status'];
    
    Object.keys(round).forEach(key => {
      if (!excludedKeys.includes(key) && round[key]) {
        playerCards[key] = round[key];
      }
    });
    
    return playerCards;
  };

  // Match tile component
  const MatchTile = ({ match }) => {
    const startDateTime = formatDateTime(match.created_at);
    const endDateTime = formatDateTime(match.completed_at);
    const duration = calculateGameDuration(match.created_at, match.completed_at);

    return (
      <TouchableOpacity
        style={styles.matchTile}
        onPress={() => handleMatchPress(match)}
        activeOpacity={0.7}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchId}>Match #{match.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
            <Text style={styles.statusText}>{getStatusText(match.status) || 'INCONNU'}</Text>
          </View>
        </View>

        {match.winner && (
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerLabel}>Gagnant :</Text>
            <Text style={styles.winnerText}>👑 {match.winner}</Text>
          </View>
        )}

        <View style={styles.matchTimeInfo}>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Commencé</Text>
            <Text style={styles.timeValue}>{startDateTime.date}</Text>
            <Text style={styles.timeValue}>{startDateTime.time}</Text>
          </View>
          {match.completed_at && (
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Terminé</Text>
              <Text style={styles.timeValue}>{endDateTime.date}</Text>
              <Text style={styles.timeValue}>{endDateTime.time}</Text>
            </View>
          )}
        </View>

        <View style={styles.matchStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Durée</Text>
            <Text style={styles.statValue}>{duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Joueurs</Text>
            <Text style={styles.statValue}>{match.players?.length || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max Rounds</Text>
            <Text style={styles.statValue}>{match.round_max || 'N/D'}</Text>
          </View>
        </View>

        {match.players && match.players.length > 0 && (
          <View style={styles.playersContainer}>
            <Text style={styles.playersLabel}>Joueurs :</Text>
            <Text style={styles.playersText}>{match.players.join(', ')}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Round tile component
  const RoundTile = ({ round }) => {
    const playerCards = getPlayerCards(round);
    const playerNames = Object.keys(playerCards);
    const roundDateTime = formatDateTime(round.created_at);

    return (
      <TouchableOpacity
        style={styles.roundTile}
        onPress={() => handleRoundPress(round)}
        activeOpacity={0.7}
      >
        <View style={styles.roundHeader}>
          <Text style={styles.roundTitle}>Round {round.round_index}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(round.status) }]}>
            <Text style={styles.statusText}>{getStatusText(round.status) || 'INCONNU'}</Text>
          </View>
        </View>

        <View style={styles.roundInfo}>
          <Text style={styles.roundDate}>{roundDateTime.date} {roundDateTime.time}</Text>
          <Text style={styles.roundPlayers}>{playerNames.length} joueurs</Text>
        </View>

        <View style={styles.roundPreview}>
          {playerNames.slice(0, 4).map(player => (
            <View key={player} style={styles.playerPreview}>
              <Text style={styles.playerPreviewName}>{player}</Text>
              <Text style={styles.playerPreviewCards}>
                {Array.isArray(playerCards[player]) ? playerCards[player].length : 'N/D'} cartes
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  // Player cards component
  const PlayerCards = ({ player, cards }) => (
    <View style={styles.playerCardsContainer}>
      <View style={styles.playerCardsHeader}>
        <Text style={styles.playerCardsName}>{player}</Text>
        <Text style={styles.playerCardsCount}>
          {Array.isArray(cards) ? cards.length : 0} cartes
        </Text>
      </View>
      <View style={styles.cardsGrid}>
        {Array.isArray(cards) ? (
          cards.map((card, index) => (
            <View key={index} style={styles.cardItem}>
              <Text style={styles.cardText}>{card}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCardsText}>Aucune donnée de cartes disponible</Text>
        )}
      </View>
    </View>
  );

  // Round detail view
  const RoundDetailView = () => {
    const playerCards = selectedRound ? getPlayerCards(selectedRound) : {};
    const roundDateTime = formatDateTime(selectedRound?.created_at);

    return (
      <Animated.View
        style={[
          styles.detailContainer,
          {
            transform: [
              {
                translateX: roundSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={handleRoundBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Détails du Round {selectedRound?.round_index}</Text>
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={styles.roundOverview}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Index Round</Text>
              <Text style={styles.overviewValue}>{selectedRound?.round_index}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Statut</Text>
              <Text style={[styles.overviewValue, { color: getStatusColor(selectedRound?.status) }]}>
                {getStatusText(selectedRound?.status) || 'INCONNU'}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Créé</Text>
              <Text style={styles.overviewValue}>{roundDateTime.date} {roundDateTime.time}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Cartes des Joueurs</Text>
          {Object.entries(playerCards).map(([player, cards]) => (
            <PlayerCards key={player} player={player} cards={cards} />
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  // Match detail view
  const MatchDetailView = () => (
    <Animated.View
      style={[
        styles.detailContainer,
        {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Match #{selectedMatch?.id}</Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        <View style={styles.matchOverview}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Statut</Text>
            <Text style={[styles.overviewValue, { color: getStatusColor(selectedMatch?.status) }]}>
              {getStatusText(selectedMatch?.status) || 'INCONNU'}
            </Text>
          </View>
          {selectedMatch?.winner && (
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Gagnant</Text>
              <Text style={styles.overviewValue}>👑 {selectedMatch.winner}</Text>
            </View>
          )}
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Durée</Text>
            <Text style={styles.overviewValue}>
              {calculateGameDuration(selectedMatch?.created_at, selectedMatch?.completed_at)}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Joueurs</Text>
            <Text style={styles.overviewValue}>
              {selectedMatch?.players?.join(', ') || 'Aucun joueur'}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Max Rounds</Text>
            <Text style={styles.overviewValue}>{selectedMatch?.round_max || 'N/D'}</Text>
          </View>
        </View>

        <View style={styles.roundsSection}>
          <Text style={styles.sectionTitle}>Rounds ({rounds.length})</Text>
          {roundsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Chargement des rounds...</Text>
            </View>
          ) : rounds.length > 0 ? (
            rounds.map((round) => (
              <RoundTile key={round.id} round={round} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun round disponible pour ce match</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );

  // Loading screen
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>
            Chargement des matchs...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique des Matchs</Text>
        <Text style={styles.headerSubtitle}>
          {matches.length} matchs trouvés
        </Text>
      </View>

      <ScrollView 
        style={styles.matchesList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchTile key={match.id} match={match} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun match trouvé</Text>
            <Text style={styles.emptySubtext}>Tirez vers le bas pour actualiser</Text>
            
          </View>
        )}
      </ScrollView>

      {selectedMatch && <MatchDetailView />}
      {selectedRound && <RoundDetailView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  matchesList: {
    flex: 1,
    padding: 16,
  },
  matchTile: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  winnerLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 8,
  },
  winnerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  matchTimeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  matchStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playersLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 8,
  },
  playersText: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  detailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  detailContent: {
    flex: 1,
    padding: 16,
  },
  matchOverview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  roundsSection: {
    marginTop: 8,
  },
  roundTile: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  roundInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roundDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  roundPlayers: {
    fontSize: 12,
    color: '#6c757d',
  },
  roundPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playerPreview: {
    alignItems: 'center',
    minWidth: '22%',
    marginVertical: 4,
  },
  playerPreviewName: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  playerPreviewCards: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
  },
  roundOverview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerCardsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerCardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  playerCardsName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  playerCardsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardItem: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '45%',
  },
  cardText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  noCardsText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default PlaceholderCardGameHistoryTab;