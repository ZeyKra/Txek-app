import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import UserInput from "@/components/UserInput";
import TxekButton from "@/components/TxekButton";
import ConnexionModal from "@/components/ConnexionModal";
import { useState } from "react";

export default function TabIndex() {

  const [isModalVisible, setIsModalVisible] = useState(false);


  return (
    
    <View style={styles.container}>
      <ConnexionModal
        setIsVisible={() => setIsModalVisible(!isModalVisible)}
        isVisibile={isModalVisible}
        onLogin={ () => { console.log("Confirm");} }
        onCancel={ () => {}}
        message="Voulez-vous créer une nouvelle partie à partir des parametres de la partie précédente ?"
      />
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <UserInput
        placeholder="Entrez votre email"
        autoCapitalize="none"
        backgroundColor="#fff" backgroundFadeColor="#B7AEAE"
        outlineColor="#6E48AD" outlineFadeColor="#4E3379"
        onChangeText={(text) => console.log(text)}
      />
      <TxekButton 
        text="TxekButton"
        buttonColor="#6E48AD" buttonShadowColor="#4E3379"
        onPress={ () => { console.log("Custom button pressed");
        }} 
      />
      <TxekButton 
        text="Bouton"
        variant="primary"
        onPress={ () => { setIsModalVisible(!isModalVisible); }} 
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  
});


