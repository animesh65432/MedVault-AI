import { scale } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Filter: React.FC = () => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather
                    name="search"
                    size={scale(18)}
                    color="#23423B"
                    onPress={() => router.push({
                        pathname: "/SearchDocuments",
                        params: {
                            ShowResults: "false"
                        }
                    })}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: scale(10),
    },
    iconContainer: {
        width: scale(35),
        height: scale(35),
        borderWidth: 1,
        borderRadius: scale(10),
        justifyContent: "center",
        alignItems: "center",
        borderBlockColor: "#23423B"
    },
    dropdown: {
        height: scale(35),
        borderWidth: 1,
        borderColor: "black",
        borderRadius: scale(10),
        paddingHorizontal: scale(10),
        borderBlockColor: "#1f2020",
        minWidth: scale(250)
    },
    dropdownList: {
        borderRadius: scale(10),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
    },
});

export default Filter;