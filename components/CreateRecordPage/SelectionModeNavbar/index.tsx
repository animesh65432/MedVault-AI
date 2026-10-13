import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
    removeSelectedDocuments: () => void;
}

const SelectionModeNavbar: React.FC<Props> = ({ removeSelectedDocuments }) => {
    return (
        <View
            style={styles.Container}
        >
            <AntDesign
                onPress={removeSelectedDocuments}
                name="delete"
                size={scale(24)}
                style={styles.Icon}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        backgroundColor: "white",
        paddingVertical: vScale(20),
        paddingHorizontal: scale(30),
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    Icon: {
        color: "#23423B",
        marginTop: vScale(15),
    }
})

export default SelectionModeNavbar