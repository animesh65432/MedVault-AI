import { UserNameContext } from '@/context/UserName'
import { GetFirstName } from '@/utils/getfirstName'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Title: React.FC = () => {
    const { userName } = useContext(UserNameContext)

    return (
        <View style={styles.container}>
            <Text
                style={styles.greeting}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
            >
                {`Welcome, ${GetFirstName(userName)} 👋`}

            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: vScale(3),
    },
    greeting: {
        fontSize: scale(18),
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
        marginBottom: vScale(4),
    },
})

export default Title