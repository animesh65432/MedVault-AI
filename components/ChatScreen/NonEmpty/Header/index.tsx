import { NetworkContext } from '@/context/Netwrok';
import { scale } from '@/utils/scale';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Header: React.FC = () => {
    const { isOnline } = useContext(NetworkContext)
    return (
        <View style={styles.Container}>
            <View style={styles.firstChild}>
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={scale(40)}
                    color="black"
                />
                <View style={styles.secondChild}>
                    <Image
                        source={require("../../../../assets/images/app-icon.png")}
                        style={styles.image}
                    />
                    <View>
                        <Text style={styles.title}>MedVault AI</Text>
                        <View style={styles.SubtitleContainer}>
                            <Entypo
                                name="dot-single"
                                size={scale(22)}
                                color="#0d280d"
                            />
                            {isOnline ?
                                <Text style={styles.subtitle}>Online</Text> :
                                <Text style={styles.subtitle}>Offline</Text>
                            }
                        </View>
                    </View>
                </View>
            </View>
            <Entypo
                name="dots-three-vertical"
                size={scale(24)}
                color="black"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scale(10),
        paddingTop: scale(30),
        backgroundColor: "#fff"
    },
    image: {
        width: scale(50),
        height: scale(60)
    },
    firstChild: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10)
    },
    secondChild: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10)
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
    },
    subtitle: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(12)
    },
    SubtitleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
})

export default Header