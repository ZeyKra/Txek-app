import { Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "@/components/Themed";
import TxekButton from "./TxekButton";
import { useState } from "react";
import { clearStorageToken, clearStorageUserData, getStorageToken } from "@/app/backend/storage";
import config from "@/config.json";

type DevelopperModalProps = {
    isVisibile: boolean;
    setIsVisible: (visible: boolean) => void;
}

export default function DeveloperModal(props: DevelopperModalProps) {

    const [message, setMessage] = useState<string>('');

    function handleClearStorageToken(): void {
        clearStorageToken;
        setMessage("Token supprimé avec succès.");
    }

    function handleClearStorageUserData(): void {
        clearStorageUserData();
        setMessage("Données utilisateur supprimées avec succès.");
    }

    const handleCORSRequest = async () => {
        const URL = config.API_URL; // Ensure this is defined in your config
        const matchId = "1v2guhh1sqi8nlwyrx1e"; // Example match ID
        const token = getStorageToken();

        const reqBody = {
            winner: "Dodo",
            status: "in_progress"
        };

        try {

            const response = await fetch(`${URL}/protected/matches/${matchId}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` // Ensure you have the correct token
                },
                body: JSON.stringify({ reqBody })
            });

            const data = await response.json();
            setMessage(data)
            console.log('CORS request successful:', data);
        } catch (error) {
            console.error('Error during CORS request:', error);
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
                                props.setIsVisible(false);
                                // Clear form when closing
                            }}
                        >
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>

                        <Text style={styles.modalText} numberOfLines={3} ellipsizeMode="tail">
                            Cette fonctionnalité est réservée aux développeurs.
                            Panel de bouttons pour tester les fonctionnalités de l'application.
                        </Text>

                        <View style={styles.ModalContainer}>
                            <TxekButton
                                onPress={handleClearStorageToken}
                                text="Supprimer le token"
                                variant="primary"
                                buttonColor="#56BB4F"
                                buttonShadowColor="#40853B"
                            />
                            <TxekButton
                                onPress={handleClearStorageUserData}
                                text="Supprimer les données utilisateur"
                                variant="primary"
                                buttonColor="#E74C3C"
                                buttonShadowColor="#C0392B"
                            />
                            <TxekButton
                                onPress={handleCORSRequest}
                                text="Tester CORS Request"
                                variant="primary"
                                buttonColor="#E03C38"
                                buttonShadowColor="#CB1612"
                            />
                        </View>

                        {message.length > 1 ? (
                            <Text style={styles.messageText}>{message}</Text>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ModalContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%'
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
        position: 'relative',
        backgroundColor: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
    },
    messageText: {
        fontFamily: 'FeatherBold',
        color: 'green',
        fontSize: 12,
        marginTop: 5,
        alignSelf: 'flex-start',
        marginLeft: '5%',
    }
});
