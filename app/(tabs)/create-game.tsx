import { Button, Pressable, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

export default function CreateGamePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une partie</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgb(240, 50, 50)"
      />
      {/* <Button title="Start Game" onPress={() => {}} /> */}
      <Link href="/(game)/game" style={styles.button} asChild>
        <Pressable>
          <Text> Créer Game</Text>
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
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    color: "white",
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
