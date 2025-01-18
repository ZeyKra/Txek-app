import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>game</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      {['Joueur 1', 'Joueur 2', 'Joueur 3'].map((player, index) => (
              <Text key={index} style={styles.title}>{player}</Text>
            ))}
      <Link href="/" style={styles.button}>
        <Pressable>
          <Text> Game </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#841584',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
