import { UserNameContext } from '@/context/UserName'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React, { useContext } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const UserIcon: React.FC = () => {
    const router = useRouter()
    const { userName, profilePic } = useContext(UserNameContext)
    return (
        <TouchableOpacity
            onPress={() => router.push("/Profile")}
        >
            {profilePic ?
                <Image
                    source={{ uri: profilePic }}
                    style={styles.userIcon}
                /> :
                <View
                    style={styles.userIconPlaceholder}
                >
                    <Text style={styles.text}>
                        {userName.charAt(0).toLocaleUpperCase()}
                    </Text>
                </View>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    userIcon: {
        width: scale(40),
        height: vScale(40),
        borderRadius: scale(20)
    },
    userIconPlaceholder: {
        width: scale(40),
        height: vScale(40),
        borderRadius: scale(20),
        backgroundColor: '#23423B',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: scale(18),
        fontFamily: 'Aeonik-Medium'
    }
})

export default UserIcon