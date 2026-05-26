import React from 'react';
import { Toast } from 'toastify-react-native';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from "expo-router"
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';

const UploadModal: React.FC = () => {

    const router = useRouter();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            router.push({
                pathname: "/DocumentResult",
                params: {
                    fileUri: result.assets[0].uri,
                    fileName: result.assets[0].fileName,
                    fileType: result.assets[0].mimeType || "image/jpeg",
                },
            });
        }
    };

    const takePhoto = async () => {
        const permission =
            await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Toast.error('Camera permission is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            router.push({
                pathname: "/DocumentResult",
                params: {
                    fileUri: result.assets[0].uri,
                    fileName: `photo_${Date.now()}.jpg`,
                    fileType: result.assets[0].mimeType || "image/jpeg",
                },
            });
        }
    };

    return (
        <View style={styles.overlay}>
            <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => router.back()}
            />

            <View style={styles.modal}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons
                        name="close"
                        size={scale(22)}
                        color="#222"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    Upload Document
                </Text>

                {/* Gallery Upload */}
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPress={pickImage}
                >
                    <MaterialIcons
                        name="photo-library"
                        size={scale(18)}
                        color="#EEF6A2"
                    />

                    <Text style={styles.text}>
                        Upload From Gallery
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPress={takePhoto}
                >
                    <MaterialIcons
                        name="camera-alt"
                        size={scale(18)}
                        color="#EEF6A2"
                    />

                    <Text style={styles.text}>
                        Take Photo
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },

    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: scale(24),
        borderTopRightRadius: scale(24),
        padding: scale(20),
        paddingBottom: vScale(40),
        minHeight: '52%',
    },

    closeButton: {
        alignSelf: 'flex-end',
        padding: scale(4),
    },

    title: {
        fontSize: scale(20),
        fontFamily: 'Aeonik-Bold',
        color: '#111',
        marginBottom: vScale(20),
    },

    button: {
        marginTop: vScale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),

        backgroundColor: '#23423B',

        paddingVertical: vScale(14),
        borderRadius: scale(14),

        width: '100%',
    },

    text: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#EEF6A2',
    },
});

export default UploadModal;