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
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Platform } from "react-native";

import { Text } from "@/components/Themed";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import UserInput from "@/components/UserInput";

import type { TxekMatch } from "@/type/TxekMatch";
import { createGame, createPlayer } from "@/app/backend/functions/functions";
import { exportLastGameSettings } from "../backend/functions/storage";

export default function GameSettingsPage() {  
  const [players, setPlayers] = useState<string[]>([""]);
  
  const params = useLocalSearchParams() ?? {}; 
  // Passage de param dans une autre variable a
  const matchDataParam = params.matchData as string | undefined;

  useEffect(() => {
    let matchSettings: TxekMatch | null = null;
    try {
      if (matchDataParam) {
        matchSettings = JSON.parse(matchDataParam as string) as TxekMatch;
        const playerList: string[] = matchSettings.players.map(player => player.name)
        
        setPlayers(playerList);
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données du match:', error);
    }
  }, [matchDataParam]);
  


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
    if (text.length === 0) {
      newPlayers.splice(index, 1)
    }
      
    setPlayers(newPlayers);
  };

  const handleStartGame = () => {
    // Filtrer les joueurs vides
    const validPlayers = players.filter(name => name.trim() !== "");
    
    if (validPlayers.length < 2) {
      alert("Il faut au moins 2 joueurs pour commencer une partie");
      return;
    }
    
    try {
      // Créer le jeu avec les joueurs valides
      const match = createGame(5);
      validPlayers.map(player => {
        match.players.push(createPlayer(player));
      });
      
      exportLastGameSettings(match);
      // Naviguer vers la page suivante avec les données du match
      router.push({
        pathname: "/(game)/game",
        params: { matchData: JSON.stringify(match) }
      });
    } catch (error) {
      throw new Error("Erreur lors de la création du jeu: ");
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.inputContainer}
      >
        {players.map((player : string, index: number) => (
          <UserInput
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
        <Pressable style={styles.button} onPress={handleStartGame}>
          <Text style={styles.buttonText}>Commencer la partie</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
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
