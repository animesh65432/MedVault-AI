import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from 'react-native-reanimated'

const Description = () => {
    return (
        <Animated.View
            style={styles.container}
            entering={FadeInDown
                .duration(400)
                .delay(300)
            }
        >
            <Text style={styles.title}>No documents yet</Text>
            <View>
                <Text style={styles.descriptionText}>
                    start building your medical history
                </Text>
                <Text style={styles.descriptionText}>in one place.</Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: vScale(6),
        paddingHorizontal: scale(10),
    },
    descriptionText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#5A7A74',
        textAlign: 'center',
        lineHeight: vScale(20),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(20),
        color: '#23423B',
    }
})

export default Description