import { Button, Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

export default function TabCreateGame() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une partie</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgb(240, 50, 50)"
      />
      {/* <Button title="Start Game" onPress={() => {}} /> */}
      <Link href="/(game)/player-select" style={styles.button} asChild>
        <Pressable>
          <Text style={styles.button_text}> Créer Game</Text>
        </Pressable>
      </Link>
      <Link href="/(settings)/game-history" style={styles.button} asChild>
        <Pressable>
          <Text style={styles.button_text}> Charger Partie</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: '#E03C38',
    padding: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    color: 'white',
    borderBottomWidth: 5,
    borderColor: '#CB1612',
    transform: [{ translateY: -4 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: .3,
    shadowRadius: 4,
    elevation: 8,
    marginVertical: 3, // Added margin between buttons
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button_text: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'FeatherBold',
    color: 'white'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
