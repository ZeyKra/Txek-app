import { type CameraType, CameraView } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';

import { FontAwesome6 } from "@expo/vector-icons"
import { checkCard } from '../backend/moondream/imagerecognition';


export default function CountPointsPage() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Function to take a photo
  const takePicture = async () => {
    if (cameraRef.current?.takePictureAsync) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        if (photo?.uri) {
          setPhotoUri(photo.uri);
          //Alert.alert('Photo prise', `Photo sauvegarder: ${photo.uri}`);
          //console.log('Captured photo:', photo);
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

  //Fonction pour changer la camera (forntale|arriere)
  const changeCameraFacing = async () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={{ flex: 1 }}>
      {photoUri ? (
        <View style={{ flex: 1 }}>
          {/* Display captured photo */}
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={() => { checkCard(photoUri) }}>
            <Text style={styles.text}>Choisir cette photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
            <Text style={styles.text}>Prendre une nouvelle photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          onCameraReady={() => console.log('La camera est prête')}
          facing={facing}
        >
          <View style={styles.topcontrols}>
            <TouchableOpacity style={styles.arrow} onPress={changeCameraFacing}>
              <FontAwesome6 name="arrows-rotate" size={32} color="white" />
            </TouchableOpacity>
          </View>
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
  topcontrols: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems : 'flex-end',
    paddingTop: 20,
    paddingEnd: 20,
  }, 
  arrow: {
    color: '#fff',
    justifyContent: 'flex-start'
  }
});