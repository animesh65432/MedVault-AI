import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
    toastContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(12),
        borderRadius: 16,
        paddingLeft: 14,
        paddingRight: 18,
        paddingVertical: 14,
        backgroundColor: "#FFFFFF",
        elevation: 8,
        shadowColor: "#0D1F1C",
        shadowOpacity: 0.14,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
        width: "90%",
        alignSelf: "center",
    },
    iconWrap: {
        width: scale(34),
        height: scale(34),
        borderRadius: scale(17),
        alignItems: "center",
        justifyContent: "center",
    },
    textWrap: {
        flex: 1,
        justifyContent: "center",
    },
    text1: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13.5),
        color: "#0D1F1C",
        marginBottom: 2,
    },
    text2: {
        fontFamily: "Aeonik-Regular",
        fontSize: fs(11.5),
        color: "#5F5E5A",
        lineHeight: fs(16),
    },
    successIconWrap: { backgroundColor: "#234338" },
    errorIconWrap: { backgroundColor: "#B91C1C" },
    infoIconWrap: { backgroundColor: "#5C8A72" },
});

const VARIANT_CONFIG = {
    success: {
        icon: "checkmark-circle",
        iconColor: "#EEF6A2",
        iconWrap: styles.successIconWrap,
    },
    error: {
        icon: "close-circle",
        iconColor: "#FFFFFF",
        iconWrap: styles.errorIconWrap,
    },
    info: {
        icon: "information-circle",
        iconColor: "#EEF6A2",
        iconWrap: styles.infoIconWrap,
    },
} as const;

function Toast(props: any) {
    const { text1, text2, variant } = props;
    const config = VARIANT_CONFIG[variant as keyof typeof VARIANT_CONFIG] ?? VARIANT_CONFIG.info;

    return (
        <View style={styles.toastContainer}>
            <View style={[styles.iconWrap, config.iconWrap]}>
                <Icon name={config.icon} size={fs(20)} color={config.iconColor} />
            </View>
            <View style={styles.textWrap}>
                {!!text1 && <Text style={styles.text1}>{text1}</Text>}
                {!!text2 && <Text style={styles.text2}>{text2}</Text>}
            </View>
        </View>
    );
}

export const toastConfig = {
    success: (props: any) => <Toast {...props} variant="success" />,
    error: (props: any) => <Toast {...props} variant="error" />,
    info: (props: any) => <Toast {...props} variant="info" />,
};