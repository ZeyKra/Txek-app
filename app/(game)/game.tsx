import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TxekMatch from '@/models/TxekMatch';
import type { TxekPlayer } from '@/types/TxekPlayer';
import type { TxekRound } from '@/types/TxekRound';
import TxekButton from '@/components/TxekButton';
import Svg, { Circle, Path } from "react-native-svg"

// UNO Card colors - restricted to red and black
const TXEK_COLORS = {
  red: "#ED1C24",
  black: "#000000",
  background: "#FFFFFF",
  border: "#000000",
  text: "#000000",
  textLight: "#FFFFFF",
}

// UNO Card values - numbered and special cards
const TXEK_VALUES = {
  numbered: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  special: ["eye", "switch", "hand", "put", "crown"],
}

// Function to parse card string (e.g., "red-5" or "black-eye")
const parseCardString = (cardString: string) => {
  const [color, value] = cardString.split('-');
  return { color, value };
};

// UNO Card component
const TxekCard = ({ color, value, size = "mini" }) => {
  const isSpecialCard = TXEK_VALUES.special.includes(value)
  const textColor = TXEK_COLORS.textLight // Always white text for better contrast

  // Get card dimensions based on size
  const getCardDimensions = () => {
    switch (size) {
      case "mini":
        return { width: 25, height: 37.5, borderRadius: 3, borderWidth: 1 }
      case "small":
        return { width: 35, height: 52.5, borderRadius: 4, borderWidth: 1 }
      case "normal":
        return { width: 50, height: 75, borderRadius: 6, borderWidth: 1 }
      default:
        return { width: 25, height: 37.5, borderRadius: 3, borderWidth: 1 }
    }
  }

  // Get text size based on card size
  const getTextSize = () => {
    switch (size) {
      case "mini":
        return { corner: 6, center: 8 }
      case "small":
        return { corner: 8, center: 12 }
      case "normal":
        return { corner: 10, center: 16 }
      default:
        return { corner: 6, center: 8 }
    }
  }

  const cardDimensions = getCardDimensions()
  const textSize = getTextSize()

  // Render special card symbol
  const renderSpecialSymbol = () => {
    const symbolSize = size === "mini" ? 10 : size === "small" ? 14 : 18

    switch (value) {
      case "eye":
        return (
          <Svg height={symbolSize} width={symbolSize} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="4" fill={textColor} />
            <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={textColor} strokeWidth="2" />
          </Svg>
        )
      case "switch":
        return (
          <Svg height={symbolSize} width={symbolSize} viewBox="0 0 24 24">
            <Path
              d="M7 16l-4-4 4-4M17 8l4 4-4 4"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M3 12h18"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )
      case "hand":
        return (
          <Svg height={symbolSize} width={symbolSize} viewBox="0 0 24 24">
            <Path
              d="M6.5 12H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1.5"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M12 17V3M8 7l4-4 4 4"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )
      case "put":
        return (
          <Svg height={symbolSize} width={symbolSize} viewBox="0 0 24 24">
            <Path
              d="M6.5 12H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1.5"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M12 7v14M8 17l4 4 4-4"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )
      case "crown":
        return (
          <Svg height={symbolSize} width={symbolSize} viewBox="0 0 24 24">
            <Path
              d="M3 18h18M5 14l3-8 4 2 4-2 3 8"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 8l-2-4h4l-2 4"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )
      default:
        return null
    }
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: TXEK_COLORS[color],
          borderColor: TXEK_COLORS.border,
          width: cardDimensions.width,
          height: cardDimensions.height,
          borderRadius: cardDimensions.borderRadius,
          borderWidth: cardDimensions.borderWidth,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.cardCornerValue,
            {
              color: textColor,
              fontSize: textSize.corner,
            },
          ]}
        >
          {isSpecialCard ? value.substring(0, 1).toUpperCase() : value}
        </Text>

        {isSpecialCard ? (
          renderSpecialSymbol()
        ) : (
          <Text
            style={[
              styles.cardCenterValue,
              {
                color: textColor,
                fontSize: textSize.center,
              },
            ]}
          >
            {value}
          </Text>
        )}

        <Text
          style={[
            styles.cardCornerValue,
            styles.bottomCorner,
            {
              color: textColor,
              fontSize: textSize.corner,
            },
          ]}
        >
          {isSpecialCard ? value.substring(0, 1).toUpperCase() : value}
        </Text>
      </View>
    </View>
  )
}

// Component to display player's deck of cards
const PlayerDeckDisplay = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return (
      <View style={styles.noDeckContainer}>
        <Text style={styles.noDeckText}>Aucune carte</Text>
      </View>
    )
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.deckContainer}
    >
      {cards.map((cardString, index) => {
        const { color, value } = parseCardString(cardString);
        return (
          <View key={`${cardString}-${index}`} style={styles.cardWrapper}>
            <TxekCard color={color} value={value} size="mini" />
          </View>
        );
      })}
    </ScrollView>
  )
}

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

  const handleFinishGameButton = () => {

    router.push({
      pathname: '/(game)/game-end',
      params: { matchData: JSON.stringify(match) },
    })
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Round {match.getCurrentRoundIndex() + 1}</Text>
        <Text style={styles.subtitle}>Nombre de manches: {match.roundMax + 1}</Text>

        <View style={styles.playersSection}>
          <Text style={styles.playersTitle}>Joueurs:</Text>
          {match.players.map((player, index) => (
            <View key={index} style={styles.playerCard}>
              <View style={styles.playerHeader}>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerPoints}>Points: {player.points}</Text>
                </View>
                <View style={styles.addButtonWrapper}>
                  <TxekButton
                    text="+"
                    variant="secondary"
                    onPress={() => {
                      console.log(`Button pressed for ${player.name}`);
                      handleCountPointsButton(player, match);
                    }}
                    size="small"
                  />
                </View>
              </View>
              
              <View style={styles.deckSection}>
                <Text style={styles.deckLabel}>Deck:</Text>
                <PlayerDeckDisplay cards={currentRound[player.name]} />
              </View>
            </View>
          ))}
        </View>

        {/* Boutton Manche suivante */}
        <View style={styles.buttonContainer}>
          {match.getCurrentRoundIndex() < match.roundMax ? (
            <TxekButton 
              text="Manche suivante"
              variant="primary"
              onPress={ () => { handleNextRoundButton(); }} 
            />
          ) : (
            <TxekButton 
              text="Finir la partie"
              variant="secondary"
              onPress={ () => { handleFinishGameButton(); }} 
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  playersSection: {
    marginBottom: 30,
  },
  playersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  playerPoints: {
    fontSize: 14,
    color: '#666',
  },
  addButtonWrapper: {
    width: 50,
    height: 40,
  },
  deckSection: {
    marginTop: 10,
  },
  deckLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  deckContainer: {
    paddingRight: 10,
  },
  cardWrapper: {
    marginRight: 4,
  },
  noDeckContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 15,
    alignItems: 'center',
  },
  noDeckText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  // Card styles (copied from count-points.tsx)
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cardContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
  },
  cardCornerValue: {
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  cardCenterValue: {
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomCorner: {
    alignSelf: "flex-end",
    transform: [{ rotate: "180deg" }],
  },
});