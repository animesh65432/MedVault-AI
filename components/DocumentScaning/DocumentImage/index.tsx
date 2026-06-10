import React, { useEffect, useRef } from 'react'
import { vScale } from "@/utils/vScale"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Image, StyleSheet, Animated, View, Text } from 'react-native';

type Props = {
    fileUri: string;
    fileType: string;
    fileName: string;
}

const DocumentImage: React.FC<Props> = ({ fileUri, fileType, fileName }) => {

    const scanAnim = useRef(new Animated.Value(0)).current;
    const isPdf = fileType === 'application/pdf';

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: vScale(300),
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return () => scanAnim.stopAnimation();
    }, []);

    return (
        <View style={styles.imageContainer}>
            {isPdf ? (
                <View style={styles.PdfContainer}>
                    <AntDesign
                        name="file-pdf"
                        size={vScale(80)}
                        color="#133824"
                    />
                    <Text>{fileName}</Text>
                </View>
            ) : (
                <Image
                    source={{ uri: fileUri }}
                    resizeMode="contain"
                    style={styles.image}
                    alt={fileName}
                />
            )}

            <Animated.View
                style={[
                    styles.scanLine,
                    {
                        transform: [{ translateY: scanAnim }],
                    },
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
        overflow: 'hidden',
        width: vScale(300),
        height: vScale(300),
        marginVertical: vScale(20),
        borderRadius: vScale(16),
        borderColor: '#133824',
        borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%',
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: "#133824",
    },
    PdfContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: vScale(12),
        color: '#133824',
        borderColor: '#133824',
        borderWidth: 1,
        borderRadius: vScale(16),
    }
})

export default DocumentImage