import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'


const CreateRecord: React.FC = () => {
    const router = useRouter()

    return (
        <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            <View style={styles.modal}>
                <View style={styles.handle} />
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <MaterialIcons name="create" size={24} color="#1D7A5F" />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>Create Record</Text>
                        <Text style={styles.description}>
                            Group related medical documents together
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.8}
                    onPress={() => router.push("/(CreateRecord)")}
                >
                    <View style={styles.cardIcon}>
                        <AntDesign name="plus" size={scale(18)} color="#FFFFFF" />
                    </View>

                    <View style={styles.labelContainer}>
                        <Text style={styles.buttonText}>Create new record</Text>
                        <Text style={styles.buttonDescription}>
                            Organize documents into a collection
                        </Text>
                    </View>

                    <View style={styles.chevron}>
                        <AntDesign name="right" size={scale(12)} color="#5F5E5A" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(13,20,17,0.55)',
        justifyContent: 'flex-end',
    },

    modal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: scale(28),
        borderTopRightRadius: scale(28),
        paddingHorizontal: scale(20),
        paddingTop: vScale(10),
        paddingBottom: vScale(48),
    },

    handle: {
        alignSelf: 'center',
        width: scale(40),
        height: vScale(4),
        borderRadius: scale(2),
        backgroundColor: '#E3E1D8',
        marginBottom: vScale(20),
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerIcon: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(14),
        backgroundColor: "#E6F2EC",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },

    headerText: {
        flex: 1,
    },

    title: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(18),
        color: '#2C2C2A',
    },

    description: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(12),
        color: '#8A8A7C',
        marginTop: vScale(2),
    },

    card: {
        marginTop: vScale(24),
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(14),
        borderRadius: scale(18),
        backgroundColor: '#FAF9F5',
        borderWidth: 1,
        borderColor: '#EDEBE2',
    },

    cardIcon: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: "#1D7A5F",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },

    labelContainer: {
        flex: 1,
    },

    buttonText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#2C2C2A',
    },

    buttonDescription: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(11),
        color: '#8A8A7C',
        marginTop: vScale(2),
    },

    chevron: {
        width: scale(26),
        height: scale(26),
        borderRadius: scale(13),
        backgroundColor: '#F1EFE8',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelButton: {
        marginTop: vScale(14),
        paddingVertical: vScale(14),
        borderRadius: scale(16),
        alignItems: 'center',
    },

    cancelText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#8A8A7C',
    },
})

export default CreateRecord