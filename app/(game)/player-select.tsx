/**
 * Page de sélection des joueurs permettant d'ajouter/supprimer des participants au jeu.
 * 
 * @component
 * 
 * @description
 * Affiche une liste d'inputs permettant de saisir les noms des joueurs.
 * - Ajoute automatiquement un nouveau champ quand le dernier est rempli
 * - Supprime un champ quand il est vidé (sauf le premier)
 * - Limite le nombre maximum de joueurs à 8
 * 
 * @state
 * - players {string[]} - Tableau contenant les noms des joueurs
 * 
 * @returns Composant React Native avec un ScrollView contenant:
 * - Des champs de saisie pour les noms des joueurs
 * - Un bouton pour accéder à la page de jeu / comptage des points
 */
import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { useState } from "react";
import UserInput from "@/components/UserInput";


export default function PlayerSelectPage() {
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
    if (text.length === 0 && index !== 0) {
      newPlayers.splice(index, 1)
    }

    setPlayers(newPlayers);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inputContainer}
    >
      {players.map((player : string, index: number) => (
        <UserInput
          key={index}
          value={player}
          onChangeText={(text) => handleInputChange(text, index)}
          placeholder="Entrez le nom du joueur..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect={false}
          backgroundColor="#fff" backgroundFadeColor="#B7AEAE"
          outlineColor="#6E48AD" outlineFadeColor="#4E3379"
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
    borderRadius: 2,
    alignItems: "center",
    color: "white",
  },
  inputContainer: {
    padding: 20,
    gap: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  input: {
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    width: "90%",
    maxWidth: 400,
    borderWidth: 5,
    borderColor: "red",
    // 
    // Outer shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0, // Sharp shadow for cartoon effect
    elevation: 8,
    // Inner shadow effect
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderRightColor: 'rgba(0,0,0,0.1)',
    // Inner shadow for cartoon effect
    borderTopColor: 'rgba(255, 0, 0, 0.5)',
    borderLeftColor: 'rgb(255, 0, 0)',
    borderTopWidth: 2,
    borderLeftWidth: 2
  }
});
