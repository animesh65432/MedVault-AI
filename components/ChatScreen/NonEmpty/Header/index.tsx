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
                <View>
                    <Image
                        source={require("../../../../assets/images/app-icon.png")}
                        style={styles.image}
                    />
                    <View>
                        <Text>MedVault AI</Text>
                        {isOnline ?
                            <Text></Text> :
                            <Text></Text>
                        }
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
        paddingVertical: scale(35)
    },
    image: {
        width: scale(40),
        height: scale(40)
    },
    firstChild: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10)
    }
})

export default Header