import React, { useCallback, useMemo, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';


interface UploadOptionProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    accent: string;
    onPress: () => void;
}

const UploadOption: React.FC<UploadOptionProps> = ({ icon, label, description, accent, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, damping: 14, stiffness: 200, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 160, useNativeDriver: true }).start()}
                activeOpacity={1}
                style={styles.option}
            >
                {/* Icon badge */}
                <View style={[styles.optionIconBadge, { backgroundColor: accent + '22' }]}>
                    <Ionicons name={icon} size={scale(22)} color={accent} />
                </View>

                {/* Text */}
                <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{label}</Text>
                    <Text style={styles.optionDescription}>{description}</Text>
                </View>

                {/* Arrow */}
                <Ionicons name="arrow-forward" size={scale(16)} color="rgba(238,246,162,0.25)" />
            </TouchableOpacity>
        </Animated.View>
    );
};


interface UploadSheetProps {
    sheetRef: React.RefObject<BottomSheet | null>;
}

const UploadSheet: React.FC<UploadSheetProps> = ({ sheetRef }) => {
    const router = useRouter();
    const snapPoints = useMemo(() => ['48%'], []);

    const close = () => sheetRef?.current?.close();

    const navigate = (fileUri: string, fileName: string, fileType?: string) => {
        close();
        router.push({
            pathname: '/(tabs)/Upload',
            params: { fileUri, fileName, fileType },
        });
    };

    const handleCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.92,
        });
        if (!result.canceled) {
            const asset = result.assets[0];
            navigate(asset.uri, asset.fileName ?? 'photo.jpg', asset.type ?? 'image/jpeg');
        }
    };

    const handleGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.92,
        });
        if (!result.canceled) {
            const asset = result.assets[0];
            navigate(asset.uri, asset.fileName ?? 'image.jpg', asset.type ?? 'image/jpeg');
        }
    };

    const handleDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*'],
            copyToCacheDirectory: true,
        });
        if (!result.canceled) {
            const picked = result.assets[0];
            navigate(picked.uri, picked.name, picked.mimeType);
        }
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.6}
            />
        ), []
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <View style={styles.sheetContent}>

                {/* Header */}
                <View style={styles.sheetHeader}>
                    <View style={styles.sheetTitleRow}>
                        <View style={styles.sheetIconBadge}>
                            <Ionicons name="cloud-upload-outline" size={scale(18)} color="#23423B" />
                        </View>
                        <View>
                            <Text style={styles.sheetTitle}>Upload Document</Text>
                            <Text style={styles.sheetSubtitle}>Choose a source to continue</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={close} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close" size={scale(18)} color="rgba(238,246,162,0.5)" />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Options */}
                <View style={styles.options}>
                    <UploadOption
                        icon="camera-outline"
                        label="Take Photo"
                        description="Capture document with your camera"
                        accent="#7DD4A8"
                        onPress={handleCamera}
                    />
                    <UploadOption
                        icon="images-outline"
                        label="Choose from Gallery"
                        description="Select an image from your library"
                        accent="#A8D4F5"
                        onPress={handleGallery}
                    />
                    <UploadOption
                        icon="document-outline"
                        label="Browse Files"
                        description="Pick a PDF or image from storage"
                        accent="#F5C97D"
                        onPress={handleDocument}
                    />
                </View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    // Sheet
    sheetBackground: {
        backgroundColor: '#1A3530',
        borderTopLeftRadius: scale(24),
        borderTopRightRadius: scale(24),
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.1)',
    },
    handleIndicator: {
        backgroundColor: 'rgba(238,246,162,0.25)',
        width: scale(36),
    },
    sheetContent: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: vScale(8),
    },

    // Header
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vScale(12),
    },
    sheetTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    sheetIconBadge: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: '#EEF6A2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetTitle: {
        fontSize: scale(16),
        fontWeight: '700',
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        letterSpacing: -0.2,
    },
    sheetSubtitle: {
        fontSize: scale(12),
        color: 'rgba(238,246,162,0.4)',
        fontFamily: 'Aeonik-Medium',
        marginTop: vScale(1),
    },
    closeButton: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(8),
        backgroundColor: 'rgba(238,246,162,0.07)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: 'rgba(238,246,162,0.07)',
        marginBottom: vScale(8),
    },

    // Options
    options: {
        gap: vScale(6),
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(14),
        backgroundColor: '#1E3A33',
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.08)',
        paddingVertical: vScale(13),
        paddingHorizontal: scale(14),
    },
    optionIconBadge: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        flex: 1,
        gap: vScale(2),
    },
    optionLabel: {
        fontSize: scale(14),
        fontWeight: '600',
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
    },
    optionDescription: {
        fontSize: scale(12),
        color: 'rgba(238,246,162,0.4)',
        fontFamily: 'Aeonik-Medium',
    },
});

export { UploadSheet };
export default UploadSheet;