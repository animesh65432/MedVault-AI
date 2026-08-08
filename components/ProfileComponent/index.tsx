import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Assistance from './Assistance'
import Logout from './LogOut'
import User from './User'

const ProfileComponent: React.FC = () => {
    return (
        <View style={styles.container}>
            <User />
            <Assistance />
            <Logout />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingTop: vScale(100),
        paddingBottom: vScale(32),
        gap: vScale(32),
    }
})

export default ProfileComponent