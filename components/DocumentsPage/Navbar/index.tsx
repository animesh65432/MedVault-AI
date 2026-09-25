import UserIcon from '@/components/UserIcon';
import { scale } from '@/utils/scale';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Navbar: React.FC = () => {
    return (
        <View style={styles.Container}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
            <UserIcon />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: scale(10)
    }
})

export default Navbar