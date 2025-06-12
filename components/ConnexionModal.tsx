import { Modal, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { View } from "@/components/Themed";
import TxekButton from "./TxekButton";
import UserInput from "./UserInput";
import { useState } from "react";
import { authAPI, type UserData, type LoginRequest } from "@/services/auth";
import { setStorageToken, setStorageUserData } from "@/app/backend/storage";

type ConnexionModalProps = {
  isVisibile: boolean;
  setIsVisible: (visible: boolean) => void;
  onLogin?: (email: string, password: string) => void;
  onCancel: () => void;
  message: string;
  confirmText?: string;
  declineText?: string;
}

export default function ConnexionModal(props: ConnexionModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const checkError = () => {
    let newError = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newError = "Format d'email inccorect"
    }
    if (!email || !password) {
      newError = "Veuillez remplir tous les champs";
    }
    return newError;
  };

  // API login function
  const handleLogin = async () => {
    // If custom onLogin is provided, use it
    if (props.onLogin) {
      props.onLogin(email, password);
      return;
    }

    if (checkError()) {
      setError(checkError())
      return;
    }

    setLoading(true);
    const creds: LoginRequest = {
      email: email,
      password: password
    }
    try {

      const data = await authAPI.login(creds)
      
      if (data) {
        // Success
        console.log('Connexion réussie:', data); //DEBUG
        const userData: UserData = await authAPI.getData(data.token);
        console.log('Données utilisateur récupérées:', userData); //DEBUG

        // Store user data/token if needed
        setStorageToken(data.token);
        setStorageUserData(userData);
        // await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        // Clear form and close modal
        setEmail('');
        setPassword('');
        setError('');
        props.setIsVisible(false);

      } else {
        // Server returned an error
        setError("Échec de la connexion")
      }
    } catch (error) {
      // Network or other error
      setError("Erreur lors de la connexion: Adresse Mail ou Mot de passe incorrect")
      //console.error('Erreur de connexion:', error); //DEBUG
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.isVisibile}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                props.onCancel();
                props.setIsVisible(false);
                // Clear form when closing
                setEmail('');
                setPassword('');
                setError('');
              }}
              disabled={loading}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalText} numberOfLines={3} ellipsizeMode="tail">
              {props.message}
            </Text>

            <View style={styles.ModalContainer}>
              <UserInput
                id="email"
                inputType="email"
                placeholder="Adresse mail"
                autoCapitalize="none"
                backgroundColor="#fff"
                backgroundFadeColor="#B7AEAE"
                outlineColor="#6E48AD"
                outlineFadeColor="#4E3379"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />

              <UserInput
                id="password"
                inputType="password"
                placeholder="Mot de passe"
                autoCapitalize="none"
                backgroundColor="#fff"
                backgroundFadeColor="#B7AEAE"
                outlineColor="#6E48AD"
                outlineFadeColor="#4E3379"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />

              <TxekButton
                onPress={handleLogin}
                text={loading ? "Connexion..." : "Se connecter"}
                variant="primary"
                buttonColor={loading ? "#cccccc" : "#56BB4F"}
                buttonShadowColor={loading ? "#999999" : "#40853B"}
                disabled={loading}
              />
              {error.length > 1 ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.2)', // Add backdrop
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%'
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 15,
  },
  modalView: {
    gap: 10,
    width: '80%',
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: '80%',
    position: 'relative',
    backgroundColor: '#fff', // Ensure background color
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15, // Changed from left to right
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  }
});