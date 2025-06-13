import { Modal, StyleSheet, Text } from "react-native";
import { View } from "@/components/Themed";
import TxekButton from "./TxekButton";

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
          testID="confirmation-modal"
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text 
                  style={styles.modalText} 
                  numberOfLines={3} 
                  ellipsizeMode="tail"
                  testID="modal-message"
                >
                  {props.message}
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <TxekButton
                        testID="confirm-button"
                        onPress={() => {
                          props.onConfirm();
                          props.setIsVisible(false);
                        }}
                        text={props.confirmText ? props.confirmText : "Oui"}
                        variant="primary"
                        buttonColor="#56BB4F" 
                        buttonShadowColor="#40853B"
                    />
                    <TxekButton
                        testID="cancel-button"
                        onPress={() => {
                          props.onCancel();
                          props.setIsVisible(false);
                        }}
                        text={props.declineText ? props.declineText : "Non"}
                        variant="primary"
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