import { StyleSheet, ViewStyle } from "react-native";
import { BaseToast, ErrorToast, ToastProps } from "react-native-toast-message";

const styles = StyleSheet.create({
    toastContainer: {
        borderLeftWidth: 5,
        borderRadius: 10,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: "#FFFFFF",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        width: "90%",
    },
    text1: {
        fontFamily: "Aeonik-Bold",
        fontSize: 15,
        color: "#234338",
        marginBottom: 2,
    },
    text2: {
        fontFamily: "Aeonik-Regular",
        fontSize: 13,
        color: "#4A5D54",
    },
    successContainer: {
        backgroundColor: "#FFFFFF",
        borderLeftColor: "#234338",
    },
    errorContainer: {
        backgroundColor: "#FFFFFF",
        borderLeftColor: "#B91C1C",
    },
    errorText1: {
        color: "#B91C1C",
    },
    infoContainer: {
        backgroundColor: "#FFFFFF",
        borderLeftColor: "#5C8A72",
    },
});

type Variant = "success" | "error" | "info";

const getContainerStyle = (variant: Variant): ViewStyle => {
    switch (variant) {
        case "success":
            return styles.successContainer;
        case "error":
            return styles.errorContainer;
        case "info":
            return styles.infoContainer;
    }
};

const CustomBaseToast = (props: ToastProps & { variant?: Variant }) => {
    const variant = props.variant ?? "success";

    return (
        <BaseToast
            {...props}
            style={[styles.toastContainer, getContainerStyle(variant)]}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    );
};

const CustomErrorToast = (props: ToastProps) => {
    return (
        <ErrorToast
            {...props}
            style={[styles.toastContainer, styles.errorContainer]}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            text1Style={[styles.text1, styles.errorText1]}
            text2Style={styles.text2}
        />
    );
};

export const toastConfig = {
    success: (props: any) => (
        <CustomBaseToast {...props} variant="success" />
    ),
    error: (props: any) => (
        <CustomErrorToast {...props} />
    ),
    info: (props: any) => (
        <CustomBaseToast {...props} variant="info" />
    ),
};