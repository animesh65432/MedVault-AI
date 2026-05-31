import React from 'react'
import { View, StyleSheet, Text, Pressable } from "react-native"
import { MedicalDocument } from '@/types'
import Upload from '../Upload'
import { vScale } from '@/utils/vScale'
import Documents from '../../Documents'
import { useRouter } from "expo-router"
import { scale } from '@/utils/scale'
import AntDesign from 'react-native-vector-icons/AntDesign'

const NonEmptyStats: React.FC<{ documents: MedicalDocument[] }> = ({ documents }) => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <Upload />
            <Documents documents={documents} />
            <Pressable
                style={styles.seeAll}
                onPress={() => router.push('/Search')}
            >
                <Text style={styles.text}>
                    See All Documents
                    <AntDesign
                        style={{ marginLeft: scale(6) }}
                        name="arrow-right"
                        size={scale(16)}
                        color="#23423B"
                    />
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: vScale(3)
    },
    seeAll: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(6),
        marginTop: vScale(18),
    },
    text: {
        marginTop: vScale(18),
        textAlign: 'center',
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(16),
        color: '#23423B',
    }
})

export default NonEmptyStats 