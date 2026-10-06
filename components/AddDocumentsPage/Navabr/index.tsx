import { DocumentRow } from '@/types';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    SelectedDocuments: DocumentRow[]
}

const Navabr: React.FC<Props> = ({
    SelectedDocuments,
}) => {
    const router = useRouter()
    return (
        <View
            style={styles.CloseIcon}
        >
            <AntDesign
                name="close"
                size={scale(20)}
                color="#090e0d"
                onPress={() => router.back()}
            />
            <Text style={styles.text}>Add photos</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    CloseIcon: {
        marginTop: vScale(10),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(20)
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(22),
        color: "#090e0d"
    }
})

export default Navabr