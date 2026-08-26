import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"

const COLORS = {
    dark: '#0D1F1C',
    darkGreen: '#234338',
    danger: '#B3261E',
    dangerBg: '#FBEAE9',
    subtitle: '#5C6B63',
    white: '#FFFFFF',
    offWhite: '#FAFAF8',
    border: '#E4E9E4',
    overlay: 'rgba(13, 31, 28, 0.5)',
}

type Props = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    handleConfirm: () => void;
}


const LogoutModel: React.FC<Props> = ({ visible, setVisible, handleConfirm }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconCircle}>
                        <AntDesign
                            name="logout"
                            size={scale(24)}
                            color={COLORS.danger}
                        />
                    </View>

                    <Text style={styles.title}>Log Out</Text>
                    <Text style={styles.subtitle}>
                        Are you sure you want to log out? You'll need to sign back in to access your documents.
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            activeOpacity={0.8}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            activeOpacity={0.85}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        alignSelf: "center"
    },
    triggerText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.danger,
    },
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(28),
    },
    card: {
        width: '100%',
        backgroundColor: COLORS.offWhite,
        borderRadius: scale(24),
        paddingTop: vScale(24),
        paddingBottom: vScale(20),
        paddingHorizontal: scale(24),
        alignItems: 'center',
    },
    iconCircle: {
        width: scale(56),
        height: scale(56),
        borderRadius: scale(28),
        backgroundColor: COLORS.dangerBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vScale(16),
    },
    title: {
        fontSize: fs(18),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.dark,
        marginBottom: vScale(8),
    },
    subtitle: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Regular',
        color: COLORS.subtitle,
        textAlign: 'center',
        lineHeight: fs(20),
        marginBottom: vScale(24),
    },
    buttonRow: {
        flexDirection: 'row',
        gap: scale(12),
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: scale(14),
        paddingVertical: vScale(14),
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    cancelText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.dark,
    },
    confirmButton: {
        flex: 1,
        borderRadius: scale(14),
        paddingVertical: vScale(14),
        alignItems: 'center',
        backgroundColor: COLORS.danger,
    },
    confirmText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.white,
    },
})

export default LogoutModel