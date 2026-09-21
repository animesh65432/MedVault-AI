import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface UploadOption {
    icon: React.ReactNode
    label: string
    description: string
    bg: string
    onPress: () => void
}

const UploadModal: React.FC = () => {
    const router = useRouter();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            router.push({
                pathname: '/ShowDocument',
                params: {
                    fileUri: result.assets[0].uri,
                    fileName: `image_${Date.now()}.jpg`,
                    fileType: result.assets[0].mimeType || 'image/jpeg',
                },
            });
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            quality: 1,
        });

        if (!result.canceled) {
            router.push({
                pathname: '/ShowDocument',
                params: {
                    fileUri: result.assets[0].uri,
                    fileName: `photo_${Date.now()}.jpg`,
                    fileType: result.assets[0].mimeType || 'image/jpeg',
                },
            });
        }
    };

    const pickPdf = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            router.push({
                pathname: '/ShowDocument',
                params: {
                    fileUri: asset.uri,
                    fileName: asset.name,
                    fileType: 'application/pdf',
                },
            });
        }
    };
    const options: UploadOption[] = [
        {
            icon: <MaterialIcons name="camera-alt" size={scale(20)} color="#3B6D11" />,
            label: 'Take Photo',
            description: 'Use camera to capture',
            bg: '#EAF3DE',
            onPress: takePhoto,
        },
        {
            icon: <MaterialIcons name="photo-library" size={scale(20)} color="#534AB7" />,
            label: 'Upload from Gallery',
            description: 'Choose an image from your library',
            bg: '#F0E7FA',
            onPress: pickImage,
        },
        {
            icon: <AntDesign name="file-pdf" size={scale(20)} color="#185FA5" />,
            label: 'Choose PDF File',
            description: 'Select a PDF document',
            bg: '#E6F1FB',
            onPress: pickPdf,
        },
    ];

    return (
        <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />

            <Animated.View style={styles.modal}>
                <View style={styles.handle} />

                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>Upload Document</Text>
                        <Text style={styles.descriptionText}>Choose how you'd like to add it.</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="close" size={scale(18)} color="#5F5E5A" />
                    </TouchableOpacity>
                </View>

                {options.map((opt, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        activeOpacity={0.7}
                        onPress={opt.onPress}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: opt.bg }]}>
                            {opt.icon}
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.buttonText}>{opt.label}</Text>
                            <Text style={styles.description}>{opt.description}</Text>
                        </View>
                        <AntDesign name="right" size={scale(15)} color="#C7C5B8" />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.85}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

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
        paddingBottom: vScale(32),
    },
    handle: {
        width: scale(36),
        height: vScale(4),
        borderRadius: 2,
        backgroundColor: '#E5E3D8',
        alignSelf: 'center',
        marginBottom: vScale(16),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: vScale(6),
    },
    headerText: {
        flexDirection: 'column',
        gap: vScale(4),
    },
    closeButton: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: '#F1EFE8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: scale(17),
        fontFamily: 'Aeonik-Bold',
        color: '#0D483F',
    },
    descriptionText: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(12),
        color: '#8A8A7C',
    },
    button: {
        marginTop: vScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(12),
        paddingVertical: vScale(12),
        borderRadius: scale(16),
        // no border here on purpose — bordered rows read as input fields,
        // not tappable list actions
    },
    iconContainer: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(13),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    labelContainer: {
        flex: 1,
        marginLeft: scale(14),
    },
    buttonText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#2C2C2A',
    },
    description: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(11),
        color: '#8A8A7C',
        marginTop: vScale(2),
    },
    cancelButton: {
        marginTop: vScale(18),
        paddingVertical: vScale(14),
        borderRadius: scale(14),
        backgroundColor: '#F1EFE8',
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#5F5E5A',
    },
});

export default UploadModal;