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

        console.log(
            'DocumentPicker result:',
            JSON.stringify(result, null, 2)
        );

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

    const options = [
        {
            icon: <MaterialIcons name="camera-alt" size={scale(24)} color="#064E3B" />,
            label: 'Take Photo',
            description: 'Use camera to capture',
            onPress: takePhoto,
        },
        {
            icon: <MaterialIcons name="photo-library" size={scale(24)} color="#064E3B" />,
            label: 'Upload from Gallery',
            description: 'Choose an image from your library',
            onPress: pickImage,
        },
        {
            icon: <AntDesign name="file-pdf" size={scale(24)} color="#064E3B" />,
            label: 'Choose PDF File',
            description: 'Select a PDF document',
            onPress: pickPdf,
        },
    ];

    return (
        <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />

            <Animated.View
                style={styles.modal}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Upload Document</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                        <MaterialIcons name="close" size={scale(22)} color="#222" />
                    </TouchableOpacity>
                </View>

                {options.map((opt, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={opt.onPress}
                    >
                        <View style={styles.iconContainer}>{opt.icon}</View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.buttonText}>{opt.label}</Text>
                            <Text style={styles.description}>{opt.description}</Text>
                        </View>
                        <AntDesign name="right" size={scale(16)} color="#9CA3AF" />
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
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: scale(24),
        borderTopRightRadius: scale(24),
        padding: scale(20),
        paddingBottom: vScale(76),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vScale(20),
    },
    closeButton: {
        padding: scale(4),
    },
    title: {
        fontSize: scale(20),
        fontFamily: 'Aeonik-Bold',
        color: '#111',
    },
    button: {
        marginTop: vScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: vScale(14),
        borderRadius: scale(14),
        borderColor: '#6B8E8B',
        borderWidth: 1,
    },
    iconContainer: {
        width: scale(36),
        alignItems: 'center',
    },
    labelContainer: {
        flex: 1,
        marginLeft: scale(10),
    },
    buttonText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#111',
    },
    description: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(12),
        color: '#6B7280',
        marginTop: vScale(2),
    },
    cancelButton: {
        marginTop: vScale(16),
        paddingVertical: vScale(14),
        borderRadius: scale(14),
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#374151',
    },
});

export default UploadModal;