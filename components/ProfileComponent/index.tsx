import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import GenrateSummaryCard from './Genratesummary'
import Logout from './LogOut'
import User from './User'

const ProfileComponent: React.FC = () => {
    return (
        <View style={styles.container}>
            <User />
            <GenrateSummaryCard />
            <Logout />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingTop: vScale(80),
        paddingBottom: vScale(32),
        gap: vScale(52),
    }
})

export default ProfileComponent