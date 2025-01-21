import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

export default function CountPointsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compter points</Text>
      <Pressable>
        <Text> Compter les pts</Text>
      </Pressable>
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
