import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { useState } from "react";

export default function PlayerInput() {
  const [players, setPlayers] = useState<string[]>([""]);

  const handleInputChange = (text: string, index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = text;

    // Ajout d'un nouvel input field si le denier est remplit
    if (text.length > 0 && index === players.length - 1) {
      if (players.length < 8) {
        newPlayers.push("");
      }
    }

    // Si l'input selectioner et vider et ce n'est pas le premier ça la supprime
    if (text.length === 0 && index !== 0 && index === players.length - 2) {
      newPlayers.pop();
    }

    setPlayers(newPlayers);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inputContainer}
    >
      {players.map((player : string, index: number) => (
        <TextInput
          key={index}
          style={styles.input}
          value={player}
          onChangeText={(text) => handleInputChange(text, index)}
          placeholder="Entrez le nom du joueur..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect={false}
        />
      ))}
      <Pressable style={styles.button}>
        <Link href="/(game)/count-points">
          <Text> Game </Text>
        </Link>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    color: "white",
  },
  inputContainer: {
    padding: 20,
    gap: 12,
    flex: 1,
    alignItems: "center", // Center horizontal
    justifyContent: "center", // Center vertical
    minHeight: "100%",
  },
  input: {
    backgroundColor: "#4B96F3",
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    color: "#fff",
    width: "90%",
    maxWidth: 400, // Maximum width
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
