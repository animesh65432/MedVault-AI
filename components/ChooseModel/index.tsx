import { AiModelContext } from "@/context/AiModel";
import { useDeviceCompatibility } from "@/hooks/useDeviceCompatibility";
import { } from "@/utils/copyPhotoToPermanentStorage";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInLeft,
} from "react-native-reanimated";

const ChooseModel: React.FC = () => {
    const { supported, loading } = useDeviceCompatibility();
    const { modelType, setModelType, downloadModel, downloadProgress, isDownloading } = useContext(AiModelContext)
    const onDeviceAvailable = supported;
    return (
        <View style={styles.Container}>
            <Animated.View
                entering={FadeInLeft.duration(400)}
            >
                <Text style={styles.title}>
                    Choose your AI model
                </Text>

                <Text style={styles.subtitle}>
                    Choose how you want MedVault AI to process your
                    documents and chats.
                </Text>
            </Animated.View>


            <View style={styles.cards}>

                <Animated.View
                    entering={FadeInLeft
                        .delay(100)
                        .duration(400)}
                >
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                            setModelType("remote");
                        }}
                        style={[
                            styles.card,
                            modelType === "remote" &&
                            styles.selectedCard,
                        ]}
                    >
                        <View style={styles.cardTop}>
                            <View style={styles.iconContainer}>
                                <Feather
                                    name="cloud"
                                    size={scale(22)}
                                    color="#23423B"
                                />
                            </View>

                            {modelType === "remote" && (
                                <View style={styles.check}>
                                    <Feather
                                        name="check"
                                        size={scale(15)}
                                        color="#FFFFFF"
                                    />
                                </View>
                            )}
                        </View>

                        <Text style={styles.cardTitle}>
                            Remote AI
                        </Text>

                        <Text style={styles.cardDescription}>
                            Powerful AI with internet access
                        </Text>

                        <View style={styles.featureRow}>
                            <Feather
                                name="message-circle"
                                size={scale(16)}
                                color="#6E827B"
                            />

                            <Text style={styles.featureText}>
                                Chat & uploads
                            </Text>
                        </View>

                        <View style={styles.featureRow}>
                            <Feather
                                name="bar-chart-2"
                                size={scale(16)}
                                color="#6E827B"
                            />

                            <Text style={styles.featureText}>
                                Limited usage
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    entering={FadeInLeft
                        .delay(200)
                        .duration(400)}
                >
                    <TouchableOpacity
                        activeOpacity={
                            onDeviceAvailable ? 0.85 : 1
                        }
                        disabled={!onDeviceAvailable}
                        onPress={() =>
                            setModelType("on-device")
                        }
                        style={[
                            styles.card,
                            modelType === "on-device" &&
                            styles.selectedCard,
                            !onDeviceAvailable &&
                            styles.disabledCard,
                        ]}
                    >
                        <View style={styles.cardTop}>
                            <View style={styles.iconContainer}>
                                <Feather
                                    name="smartphone"
                                    size={scale(22)}
                                    color={
                                        onDeviceAvailable
                                            ? "#23423B"
                                            : "#9AA7A3"
                                    }
                                />
                            </View>

                            {modelType === "on-device" &&
                                onDeviceAvailable && (
                                    <View style={styles.check}>
                                        <Feather
                                            name="check"
                                            size={scale(15)}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                )}
                        </View>

                        <Text
                            style={[
                                styles.cardTitle,
                                !onDeviceAvailable &&
                                styles.disabledText,
                            ]}
                        >
                            On-device AI
                        </Text>

                        <Text
                            style={[
                                styles.cardDescription,
                                !onDeviceAvailable &&
                                styles.disabledText,
                            ]}
                        >
                            Private and works offline
                        </Text>

                        <View style={styles.featureRow}>
                            <Feather
                                name="message-circle"
                                size={scale(16)}
                                color={
                                    onDeviceAvailable
                                        ? "#6E827B"
                                        : "#9AA7A3"
                                }
                            />

                            <Text
                                style={[
                                    styles.featureText,
                                    !onDeviceAvailable &&
                                    styles.disabledText,
                                ]}
                            >
                                Unlimited chat & uploads
                            </Text>
                        </View>

                        {!isDownloading &&

                            <TouchableOpacity
                                style={styles.featureRow}
                                onPress={() => {
                                    if (onDeviceAvailable) {
                                        downloadModel();
                                    }
                                }}
                                disabled={!onDeviceAvailable}
                            >
                                <Feather
                                    name="download"
                                    size={scale(16)}
                                    color={
                                        onDeviceAvailable
                                            ? "#6E827B"
                                            : "#9AA7A3"
                                    }
                                />

                                <Text
                                    style={[
                                        styles.featureText,
                                        !onDeviceAvailable &&
                                        styles.disabledText,
                                    ]}
                                >
                                    3 GB download
                                </Text>
                            </TouchableOpacity>
                        }
                        {isDownloading &&
                            <View style={styles.progressContainer}>
                                <View style={styles.progressHeader}>
                                    <Text style={styles.progressLabel}>
                                        Downloading model...
                                    </Text>
                                    <Text style={styles.progressPercent}>
                                        {downloadProgress}%
                                    </Text>
                                </View>

                                <View style={styles.progressTrack}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${downloadProgress}%` },
                                        ]}
                                    />
                                </View>
                            </View>
                        }

                        <View style={styles.statusContainer}>
                            {loading ? (
                                <>
                                    <View
                                        style={
                                            styles.statusDotChecking
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.checkingText
                                        }
                                    >
                                        Checking device...
                                    </Text>
                                </>
                            ) : onDeviceAvailable ? (
                                <>
                                    <View
                                        style={styles.statusDot}
                                    />

                                    <Text
                                        style={
                                            styles.supportedText
                                        }
                                    >
                                        Supported
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <View
                                        style={
                                            styles.statusDotUnsupported
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.unsupportedText
                                        }
                                    >
                                        Unsupported
                                    </Text>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    style={styles.buttonContainer}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingVertical: vScale(40),
        backgroundColor: "#F8F9FA",
    },

    title: {
        fontSize: scale(24),
        fontWeight: "bold",
        color: "#1B3B36",
        fontFamily: "Aeonik-Medium",
    },

    subtitle: {
        marginTop: vScale(8),
        fontSize: scale(15),
        lineHeight: vScale(21),
        color: "#6E827B",
        fontFamily: "Aeonik-Regular",
        maxWidth: scale(340),
    },

    cards: {
        marginTop: vScale(28),
        gap: vScale(14),
    },

    card: {
        padding: scale(18),
        borderRadius: scale(20),
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E4EAE7",
    },

    selectedCard: {
        borderColor: "#23423B",
        backgroundColor: "#F5F9F7",
    },

    disabledCard: {
        opacity: 0.72,
        backgroundColor: "#F1F4F3",
        borderColor: "#E2E7E5",
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    iconContainer: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(14),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEF6A2",
    },

    check: {
        width: scale(27),
        height: scale(27),
        borderRadius: scale(14),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#23423B",
    },

    cardTitle: {
        marginTop: vScale(15),
        fontSize: scale(19),
        fontWeight: "600",
        color: "#1B3B36",
        fontFamily: "Aeonik-Medium",
    },

    cardDescription: {
        marginTop: vScale(4),
        fontSize: scale(14),
        color: "#6E827B",
        fontFamily: "Aeonik-Regular",
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: vScale(13),
        gap: scale(8),
    },

    featureText: {
        fontSize: scale(14),
        color: "#425A54",
        fontFamily: "Aeonik-Regular",
    },

    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: vScale(16),
        gap: scale(7),
    },

    statusDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: "#3E8B67",
    },

    statusDotChecking: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: "#B5C0BC",
    },

    statusDotUnsupported: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: "#B56B6B",
    },

    supportedText: {
        fontSize: scale(13),
        color: "#3E8B67",
        fontFamily: "Aeonik-Medium",
    },

    checkingText: {
        fontSize: scale(13),
        color: "#7A8984",
        fontFamily: "Aeonik-Regular",
    },

    unsupportedText: {
        fontSize: scale(13),
        color: "#A15F5F",
        fontFamily: "Aeonik-Medium",
    },

    disabledText: {
        color: "#8A9692",
    },
    buttonContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: vScale(20),
        fontFamily: "Aeonik-Medium",
        backgroundColor: "#23423B",
        paddingVertical: vScale(10),
        paddingHorizontal: scale(20),
        borderRadius: scale(8),
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: scale(16),
        fontFamily: "Aeonik-Medium",
    },
    progressContainer: {
        marginTop: vScale(13),
    },

    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    progressLabel: {
        fontSize: scale(14),
        color: "#425A54",
        fontFamily: "Aeonik-Regular",
    },

    progressPercent: {
        fontSize: scale(13),
        color: "#23423B",
        fontFamily: "Aeonik-Medium",
    },

    progressTrack: {
        marginTop: vScale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: "#E4EAE7",
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: scale(3),
        backgroundColor: "#23423B",
    },
});

export default ChooseModel;