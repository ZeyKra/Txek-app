import { Alert, Modal, Pressable, StyleSheet, Text } from "react-native";
import { View } from "./Themed";

type ConfirmationModalProps = {
  isVisibile: boolean;
  setIsVisible: (visible: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  confirmText?: string;
  declineText?: string;
}

export default function ConfirmationModal(props: ConfirmationModalProps){
  return (
    <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.isVisibile}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText} numberOfLines={3} ellipsizeMode="tail">{props.message}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => {
                            props.onConfirm();
                            props.setIsVisible(false);
                        }}>
                        <Text style={styles.textStyle}>{props.confirmText ? props.confirmText : "Oui"}</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            props.onCancel();
                            props.setIsVisible(false);
                        }}>
                        <Text style={styles.textStyle}>{props.declineText ? props.declineText : "Non"}</Text>
                    </Pressable>
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
  modalView: {
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