import UserIcon from '@/components/UserIcon'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Navbar: React.FC = () => {
    return (
        <View style={styles.Container}>
            <UserIcon />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})

export default Navbar