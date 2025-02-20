import { StyleSheet } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { Text, View } from "@/components/Themed";
import UserInput from "@/components/UserInput";

export default function TabIndex() {
  return (
    <View style={styles.container}>
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
