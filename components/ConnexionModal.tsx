import { Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "@/components/Themed";
import TxekButton from "./TxekButton";
import UserInput from "./UserInput";

type ConnexionModalProps = {
  isVisibile: boolean;
  setIsVisible: (visible: boolean) => void;
  onLogin: () => void;
  onCancel: () => void;
  message: string;
  confirmText?: string;
  declineText?: string;
}

export default function ConnexionModal(props: ConnexionModalProps) {
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
              }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalText} numberOfLines={3} ellipsizeMode="tail">{props.message}</Text>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '20%' }}>
              <UserInput
                id="email"
                placeholder="Adresse mail"
                autoCapitalize="none"
                backgroundColor="#fff" backgroundFadeColor="#B7AEAE"
                outlineColor="#6E48AD" outlineFadeColor="#4E3379"
                onChangeText={(text) => { }}
              />
              <UserInput
                id="password"
                placeholder="Mot de passe"
                autoCapitalize="none"
                backgroundColor="#fff" backgroundFadeColor="#B7AEAE"
                outlineColor="#6E48AD" outlineFadeColor="#4E3379"
                onChangeText={(text) => { }}
              />
              <TxekButton
                onPress={() => { props.onLogin(); }}
                text={props.confirmText ? props.confirmText : "Oui"}
                variant="primary"
                buttonColor="#56BB4F" buttonShadowColor="#40853B"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )

}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'white',
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
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 15,
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
  },
});