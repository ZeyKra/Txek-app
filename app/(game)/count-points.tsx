import { CameraView } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';


export default function App() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Function to take a photo
  const takePicture = async () => {
    if (cameraRef.current?.takePictureAsync) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        if (photo?.uri) {
          setPhotoUri(photo.uri);
          Alert.alert('Photo prise', `Photo sauvegarder: ${photo.uri}`);
          console.log('Captured photo:', photo);
        } else {
          Alert.alert("La photo n'a pas pu etre prise");
        }
      } catch (error) {
        console.error('Erreur pendant la photographie:', error);
      }
    } else {
      Alert.alert('Error', 'CameraView component does not support taking pictures.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {photoUri ? (
        <View style={{ flex: 1 }}>
          {/* Display captured photo */}
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
            <Text style={styles.text}>Prendre une nouvelle photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          onCameraReady={() => console.log('La camera est prête')}
        >
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Prendre la photo</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});