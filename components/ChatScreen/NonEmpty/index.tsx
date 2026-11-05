import React from 'react'
import { StyleSheet, View } from 'react-native'
import Header from './Header'

const NonEmpty: React.FC = () => {
    return (
        <View style={styles.Conainer}>
            <Header />
        </View>
    )
}

const styles = StyleSheet.create({
    Conainer: {
        flex: 1
    }
})

export default NonEmpty 