import UserIcon from '@/components/UserIcon';
import { scale } from '@/utils/scale';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Navbar: React.FC = () => {
    return (
        <View style={styles.Container}>
            <MaterialIcons
                name="add"
                size={scale(28)}
                color="black"
            />
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
        gap: scale(10),
        marginTop: scale(30),
        paddingHorizontal: scale(20),
    }
})

export default Navbar