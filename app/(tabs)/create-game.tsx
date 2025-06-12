/**
 * Documentation en français
 * 
 * TabCreateGame est un composant React qui gère la création et le chargement de parties.
 * 
 * Fonctions:
 * - handleGameCreationButton: Gère la création d'une nouvelle partie
 *   - Vérifie s'il existe des paramètres de jeu précédents
 *   - Affiche une modal de confirmation si des paramètres existent
 *   - Redirige vers la page de paramètres si aucun paramètre n'existe
 * 
 * - handleLoadGameButton: Gère le chargement d'une partie existante
 *   - Récupère les derniers paramètres de jeu
 *   - Redirige vers la page de paramètres avec les données
 * 
 * - handleConfirm/handleCancel: Gèrent l'affichage de la modal de confirmation
 * 
 * États:
 * - isModalVisible: Contrôle l'affichage de la modal de confirmation
 */
import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { importLastGameSettings } from "../backend/storage"
import ConfirmationModal from "@/components/ConfirmationModal";
import { useState } from "react";
import TxekButton from "@/components/TxekButton";

export default function TabCreateGame() {


  /**
   *
   * fonction pour aller a la page de creation de game
   * 
   * return void
  */
  const handleCreateGameButton = async () => {
    const lastGameSettings = await importLastGameSettings();
    if(lastGameSettings !== null && lastGameSettings !== undefined){
      console.log("lastGameSettings", lastGameSettings); 
      setIsModalVisible(true)
      // Using useState directly in the component body
      return;
    }
  
    console.log("Aucune game trouvé créer une partie a zero"); // DEBUG
    
    router.push({pathname: "/(game)/game-settings"})
  };

  /**
   *
   * Fonction asynchrone qui gère la création d'une 
   * nouvelle partie a partir des paramètres de la partie précédente.
   * 
   * return void
  */
  const handleLoadGameButton = async () => {
    const lastGameSettings = await importLastGameSettings();
    if(lastGameSettings !== null && lastGameSettings !== undefined){
      console.log("lastGameSettings", lastGameSettings);
      router.push({pathname: "/(game)/game-settings", params: { matchData: JSON.stringify(lastGameSettings) }})
      return;
    }
  };



  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const handleConfirm = () => {
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    router.push({pathname: "/(game)/game-settings"})
  };

  return (
    <View style={styles.container}>


      <ConfirmationModal
        setIsVisible={() => setIsModalVisible(!isModalVisible)}
        isVisibile={isModalVisible}
        onConfirm={handleLoadGameButton}
        onCancel={handleCancel}
        message="Voulez-vous créer une nouvelle partie à partir des parametres de la partie précédente ?"
      />
      <Text style={styles.title}>Créer une partie</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgb(240, 50, 50)"
      />
      {/* <Button title="Start Game" onPress={() => {}} /> */}
   
      {/* <Link href="/(settings)/game-history" style={styles.button} asChild>
        <Pressable>
          <Text style={styles.button_text}> Charger Partie</Text>
        </Pressable>
      </Link> */}
        
      <TxekButton
        text="Lancer une nouvelle partie"
        onPress={() => {handleCreateGameButton()}}
      />
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
