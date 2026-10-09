import UserIcon from '@/components/UserIcon';
import { scale } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Navbar: React.FC = () => {
    const router = useRouter();

    const handle_redirect = (route: "/SearchDocuments" | "/RecordModel") => {
        router.push(route)
    }

    return (
        <View style={styles.Container}>
            <Feather
                name="search"
                size={scale(24)}
                color="#5c5f5f"
                onPress={() => router.push({
                    pathname: "/SearchDocuments",
                    params: {
                        ShowResults: "true"
                    }
                })}
            />
            <MaterialIcons
                name="add"
                size={scale(28)}
                color="#5c5f5f"
                onPress={() => handle_redirect("/RecordModel")}
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