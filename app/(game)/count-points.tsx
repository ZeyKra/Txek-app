"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  Modal,
  ScrollView,
  LayoutAnimation,
  UIManager,
} from "react-native"
import Svg, { Circle, Path } from "react-native-svg"

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

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

// All card values combined
const ALL_CARD_VALUES = [...TXEK_VALUES.numbered, ...TXEK_VALUES.special]

// UNO Card component - for keyboard and selected cards list
const TxekCard = ({ color, value, onPress, size = "normal", noPress = false }) => {
  const isSpecialCard = TXEK_VALUES.special.includes(value)
  const textColor = TXEK_COLORS.textLight // Always white text for better contrast

  // Get card dimensions based on size
  const getCardDimensions = () => {
    switch (size) {
      case "mini":
        return { width: 30, height: 45, borderRadius: 4, borderWidth: 1 }
      case "small":
        return { width: 50, height: 75, borderRadius: 6, borderWidth: 1 }
      case "normal":
        return { width: 60, height: 90, borderRadius: 8, borderWidth: 2 }
      case "adaptive":
        // For horizontal list, will be set by parent component
        return { width: "100%", height: "100%", borderRadius: 6, borderWidth: 1 }
      default:
        return { width: 60, height: 90, borderRadius: 8, borderWidth: 2 }
    }
  }

  // Get text size based on card size
  const getTextSize = () => {
    switch (size) {
      case "mini":
        return { corner: 8, center: 12 }
      case "small":
        return { corner: 10, center: 18 }
      case "normal":
      case "adaptive":
        return { corner: 12, center: 24 }
      default:
        return { corner: 12, center: 24 }
    }
  }

  const cardDimensions = getCardDimensions()
  const textSize = getTextSize()

  // Render special card symbol
  const renderSpecialSymbol = () => {
    const symbolSize = size === "mini" ? 16 : size === "small" ? 24 : 30

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

  const cardComponent = (
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

  if (noPress) {
    return cardComponent
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress && onPress({ color, value })}>
      {cardComponent}
    </TouchableOpacity>
  )
}

// Horizontal selected cards list
const SelectedCardsList = ({ cards, onRemoveCard, maxHeight }) => {
  const [cardSize, setCardSize] = useState({ width: 45, height: 67.5 })
  const containerRef = useRef(null)

  // Calculate card size based on container width and number of cards
  const updateCardSize = (width: number) => {
    // Get number of cards to display
    const numCards = cards.length
    if (numCards === 0) return

    // Calculate optimal card width based on available space
    // We want to show at least 4 cards if possible, with some spacing
    const spacing = 5
    const minCardWidth = 40 // Minimum width for a card
    const maxCardWidth = 60 // Maximum width for a card

    let calculatedWidth: number

    if (numCards <= 4) {
      // If we have 4 or fewer cards, distribute space evenly
      calculatedWidth = (width - (numCards + 1) * spacing) / numCards
    } else {
      // If we have more than 4 cards, aim to show about 4.5 cards
      calculatedWidth = (width - 5 * spacing) / 4.5
    }

    // Clamp the width between min and max
    calculatedWidth = Math.max(minCardWidth, Math.min(calculatedWidth, maxCardWidth))

    // Calculate height based on aspect ratio (3:2)
    const calculatedHeight = calculatedWidth * 1.5

    // Update card size
    setCardSize({
      width: calculatedWidth,
      height: calculatedHeight,
    })
  }

  // Update card size when cards change or on mount
  useEffect(() => {
    if (containerRef.current) {
      // Use LayoutAnimation for smooth transitions
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }
  }, [cards])

  // If no cards, show placeholder
  if (cards.length === 0) {
    return (
      <View style={[styles.selectedCardsListContainer, { maxHeight }]}>
        <Text style={styles.noCardsText}>No cards selected</Text>
      </View>
    )
  }

  return (
    <View
      style={[styles.selectedCardsListContainer, { maxHeight }]}
      ref={containerRef}
      onLayout={(event) => updateCardSize(event.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectedCardsListContent}
      >
        {cards.map((card, index) => (
          <View key={`${card.color}-${card.value}-${index}`} style={styles.selectedCardWrapper}>
            <View style={{ width: cardSize.width, height: cardSize.height }}>
              <TxekCard color={card.color} value={card.value} size="adaptive" noPress={true} />
            </View>
            <TouchableOpacity style={styles.removeCardButton} onPress={() => onRemoveCard(index)}>
              <Text style={styles.removeCardButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

// Color toggle button component
const ColorToggleButton = ({ activeColor, onToggle }) => {
  return (
    <TouchableOpacity style={styles.colorToggleButton} onPress={onToggle}>
      <View style={styles.colorToggleInner}>
        <View
          style={[styles.colorToggleHalf, styles.colorToggleRed, activeColor === "red" && styles.colorToggleActive]}
        />
        <View
          style={[styles.colorToggleHalf, styles.colorToggleBlack, activeColor === "black" && styles.colorToggleActive]}
        />
      </View>
    </TouchableOpacity>
  )
}

// Custom keyboard component with grid layout
const UnoKeyboard = ({ onCardSelect, visible, activeColor, onToggleColor, onDone }) => {
  // Animation value for sliding effect
  const slideAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, slideAnim])

  if (!visible) return null

  // Generate cards for the active color
  const generateCards = () => {
    const cards = []

    // Add numbered cards
    for (const value of TXEK_VALUES.numbered) {
      cards.push({
        id: `${activeColor}-${value}`,
        color: activeColor,
        value: value,
      })
    }

    // Add special cards
    for (const value of TXEK_VALUES.special) {
      cards.push({
        id: `${activeColor}-${value}`,
        color: activeColor,
        value: value,
      })
    }

    return cards
  }

  // Calculate number of columns based on screen width
  const screenWidth = Dimensions.get("window").width
  const numColumns = Math.floor(screenWidth / 65) // Adjusted for card size

  // Calculate keyboard height for animation
  const keyboardHeight = 250 // Approximate height of keyboard

  return (
    <Animated.View
      style={[
        styles.keyboardContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [keyboardHeight, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.keyboardHeader}>
        <Text style={styles.keyboardTitle}>{activeColor === "red" ? "Red" : "Black"} Cards</Text>

        <TouchableOpacity style={styles.doneButtonContainer} onPress={onDone}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Card grid */}
      <View style={styles.cardGridContainer}>
        <FlatList
          data={generateCards()}
          renderItem={({ item }) => (
            <TxekCard color={item.color} value={item.value} onPress={onCardSelect} size="small" />
          )}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.cardGrid}
          scrollEnabled={false}
        />

        {/* Color toggle button in bottom corner */}
        <ColorToggleButton activeColor={activeColor} onToggle={onToggleColor} />
      </View>
    </Animated.View>
  )
}

// Main component
const countPointPage = () => {
  const [selectedCards, setSelectedCards] = useState([])
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [activeColor, setActiveColor] = useState("red") // Default color
  const [modalVisible, setModalVisible] = useState(false)

  // Update styles when orientation changes
  useEffect(() => {
    const updateLayout = () => {
      // Force re-render on orientation change
      if (keyboardVisible) {
        setKeyboardVisible(false)
        setTimeout(() => {
          setKeyboardVisible(true)
        }, 100)
      }
    }

    // Add event listener for dimension changes
    const dimensionSubscription = Dimensions.addEventListener("change", updateLayout)

    return () => {
      // Clean up event listeners
      dimensionSubscription.remove()
    }
  }, [keyboardVisible])

  const handleCardSelect = (card) => {
    setSelectedCards((prev) => [...prev, card])
  }

  const handleRemoveCard = (index) => {
    setSelectedCards((prev) => {
      const newCards = [...prev]
      newCards.splice(index, 1)
      return newCards
    })
  }

  const showKeyboard = () => {
    // Use modal approach to avoid iOS keyboard issues
    Keyboard.dismiss()
    setModalVisible(true)
    setKeyboardVisible(true)
  }

  const hideKeyboard = () => {
    setKeyboardVisible(false)
    setTimeout(() => {
      setModalVisible(false)
    }, 300) // Wait for animation to complete
  }

  const toggleColor = () => {
    // Toggle between red and black
    setActiveColor(activeColor === "red" ? "black" : "red")
  }

  const clearSelection = () => {
    // Use LayoutAnimation for smooth transition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setSelectedCards([])
  }

  // Calculate appropriate height for selected cards list based on screen size
  const screenHeight = Dimensions.get("window").height
  const selectedCardsMaxHeight = screenHeight * 0.15 // 15% of screen height

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>UNO Card Selector</Text>

        <Text style={styles.subtitle}>Select cards from your deck</Text>

        {/* Selected Cards Horizontal List */}
        <View style={styles.selectedCardsSection}>
          <View style={styles.selectedCardsTitleRow}>
            <Text style={styles.selectedCardsTitle}>Selected Cards</Text>
            <View style={styles.selectedCardsActions}>
              <Text style={styles.selectedCardsCount}>{selectedCards.length}</Text>
              {selectedCards.length > 0 && (
                <TouchableOpacity style={styles.clearSelectionButton} onPress={clearSelection}>
                  <Text style={styles.clearSelectionButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <SelectedCardsList cards={selectedCards} onRemoveCard={handleRemoveCard} maxHeight={selectedCardsMaxHeight} />
        </View>

        <TouchableOpacity style={styles.selectCardsButton} onPress={showKeyboard}>
          <Text style={styles.selectCardsButtonText}>Select Cards</Text>
        </TouchableOpacity>
      </View>

      {/* Modal approach to avoid iOS keyboard issues */}
      <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={hideKeyboard}>
        <TouchableWithoutFeedback onPress={hideKeyboard}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View>
                <UnoKeyboard
                  visible={keyboardVisible}
                  onCardSelect={handleCardSelect}
                  activeColor={activeColor}
                  onToggleColor={toggleColor}
                  onDone={hideKeyboard}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  selectedCardsSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCardsTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectedCardsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedCardsActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCardsCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
  },
  clearSelectionButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearSelectionButtonText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "600",
  },
  selectedCardsListContainer: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  selectedCardsListContent: {
    paddingRight: 10, // Extra padding for last card
  },
  selectedCardWrapper: {
    marginRight: 5,
    position: "relative",
  },
  removeCardButton: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  removeCardButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    lineHeight: 18,
  },
  noCardsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  selectCardsButton: {
    backgroundColor: "#0072BC",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  selectCardsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  keyboardContainer: {
    backgroundColor: "#e0e0e0",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  keyboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  keyboardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  doneButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 15,
  },
  doneButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  cardGridContainer: {
    padding: 10,
    position: "relative", // For positioning the color toggle button
  },
  cardGrid: {
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 5,
    paddingBottom: 50, // Make space for the color toggle button
  },
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
    padding: 4,
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
  colorToggleButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    padding: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  colorToggleInner: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 13,
    overflow: "hidden",
  },
  colorToggleHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: "transparent",
  },
  colorToggleRed: {
    backgroundColor: TXEK_COLORS.red,
    borderTopLeftRadius: 13,
    borderBottomLeftRadius: 13,
  },
  colorToggleBlack: {
    backgroundColor: TXEK_COLORS.black,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
  },
  colorToggleActive: {
    borderColor: "white",
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
    zIndex: 1,
  },
})

export default countPointPage

