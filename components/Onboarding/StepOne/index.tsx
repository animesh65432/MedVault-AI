import React from 'react'
import { StyleSheet, View } from 'react-native'

const StepOne: React.FC = () => {
    return (
        <View style={styles.Container}>
            <View></View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    }
})

export default StepOne