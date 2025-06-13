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

import { Text, View } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import UserInput from "@/components/UserInput";
import TxekButton from "@/components/TxekButton";

import TxekMatch from "@/models/TxekMatch";
import { createPlayer } from "@/app/backend/functions/functions";
import { exportLastGameSettings } from "../backend/storage"

export default function GameSettingsPage() {  
  const [players, setPlayers] = useState<string[]>([""]);
  const [errors, setErrors] = useState<string[]>([]);
  const [rounds, setRounds] = useState<number>(3);

  const params = useLocalSearchParams() ?? {}; 
  // Passage de param dans une autre variable a
  const matchDataParam = params.matchData as string | undefined;

  useEffect(() => {
    let matchSettings: TxekMatch | null = null;
    try {
      if (matchDataParam) {
        matchSettings = JSON.parse(matchDataParam as string) as TxekMatch;
        const playerList: string[] = matchSettings.players.map(player => player.name)
        
        if (matchSettings.roundMax < 0 || matchSettings.roundMax > 10) {
          matchSettings.roundMax = 2;
        }

        setPlayers(playerList);
        setRounds(matchSettings.roundMax + 1); // rounds + 1 car le round 0 est créé automatiquement
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données du match:', error);
    }
  }, [matchDataParam]);

  const checkErrors = () => {
    const newErrors: string[] = [];
    players.map((player, index) => {
      if (player.length > 15) {
        newErrors[index] = "Le nom du joueur ne peut pas dépasser 15 caractères"; 
      }else if(player.match(/[^a-zA-Z0-9]/)) {
        newErrors[index] = "Le nom du joueur ne peut contenir que des lettres et des chiffres";       
      } else if (player.trim() !== "" && players.findIndex((p, i) => p.trim().toLowerCase() === player.trim().toLowerCase() && i !== index) !== -1) {
        newErrors[index] = "Ce nom de joueur existe déjà";
      } else {
        newErrors[index] = "";
      }
    });
    return newErrors;
  };

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
      newPlayers.splice(index, 1);
    }
    
    // Update players first, then check errors with the updated array
    setPlayers(newPlayers);
    
    // Use the newPlayers array directly for error checking instead of relying on state
    const checkErrorsWithNewPlayers = () => {
      const newErrors: string[] = [];
      newPlayers.map((player, idx) => {
        if (player.length > 15) {
          newErrors[idx] = "Le nom du joueur ne peut pas dépasser 15 caractères"; 
        } else if(player.match(/[^a-zA-Z0-9\s]/)) {
          newErrors[idx] = "Le nom du joueur ne peut contenir que des lettres et des chiffres";       
        } else if (player.trim() !== "" && newPlayers.findIndex((p, i) => 
          p.trim().toLowerCase() === player.trim().toLowerCase() && i !== idx) !== -1) {
          newErrors[idx] = "Ce nom de joueur existe déjà";
        } else {
          newErrors[idx] = "";
        }
      });
      return newErrors;
    };
    
    // Set errors based on the new players array we just created
    setErrors(checkErrorsWithNewPlayers());
  };

  const handleStartGame = () => {
    // Filtrer les joueurs vides
    const validPlayers = players.filter(name => name.trim() !== "");
    const newErrors = [...players].map(player => 
      player.trim() === "" ? "Le nom du joueur ne peut pas être vide" : ""
    );
    
    if (validPlayers.length < 2) {
      setErrors(newErrors);
      alert("Il faut au moins 2 joueurs pour commencer une partie");
      return;
    }
    
    try {
      // Créer le jeu avec les joueurs valides
      const match = new TxekMatch(rounds - 1); // rounds - 1 car le round 0 est créé automatiquement
      validPlayers.map(player => {
        match.players.push(createPlayer(player));
      });


      match.createNewRound();
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

  const incrementRounds = () => {
    if (rounds < 10) {
      setRounds(rounds + 1); // Mise à jour de la valeur dans matchSettings
    }
  };

  const decrementRounds = () => {
    if (rounds > 1) {
      setRounds(rounds - 1);
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
        <View style={styles.roundSelector}>
          <TxekButton
            text="-"
            onPress={() => decrementRounds()}
            buttonColor="#E03C38"
            buttonShadowColor="#CB1612"
            style={styles.roundTxekButton}
          />
          <Text style={styles.roundText}>{rounds}</Text>
          <TxekButton
            text="+"
            onPress={() => {incrementRounds()}}
            buttonColor="#4CAF50"
            buttonShadowColor="#388E3C"
            style={styles.roundTxekButton}
          />
        </View>
        
        {players.map((player : string, index: number) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Index utilisé pour la clé unique
          <View key={index} style={styles.inputWrapper}>
            <UserInput
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
            {errors[index] ? (
              <Text style={styles.errorText}>{errors[index]}</Text>
            ) : null}
          </View>
        ))}
        <TxekButton
          text="Commencer la partie"
          onPress={() => handleStartGame()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'FeatherBold',
    flex: 1,
    backgroundColor: "#fff",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderRightColor: 'rgba(0,0,0,0.1)',
    borderTopColor: 'rgba(255, 0, 0, 0.5)',
    borderLeftColor: 'rgb(255, 0, 0)',
    borderTopWidth: 2,
    borderLeftWidth: 2
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
  roundSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  roundTxekButton: {
    minWidth: 40,
    maxWidth: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  roundText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#495057",
    minWidth: 40,
    textAlign: 'center',
  },
});
