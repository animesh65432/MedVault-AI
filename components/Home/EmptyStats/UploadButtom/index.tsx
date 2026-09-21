import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface UploadButtomProps {
    label?: string
    subtitle?: string
}

const UploadButtom: React.FC<UploadButtomProps> = ({
    label = 'Add your first document',
    subtitle = 'Scan · Photo · PDF · More',
}) => {

    const router = useRouter()

    const handlePress = () => {
        router.push("/UploadModal")
    }
    return (
        <View
            style={styles.Container}
        >
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={handlePress}
            >
                <View style={styles.iconCircle}>
                    <Feather name="plus" size={fs(18)} color="#0D483F" />
                </View>

                <Text style={styles.label} numberOfLines={1}>
                    {label}
                </Text>

                <Feather
                    name="arrow-right"
                    size={fs(16)}
                    color="#D9F99D"
                    style={styles.arrowIcon}
                />
            </TouchableOpacity>

            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D483F',
        borderRadius: 999,
        height: vScale(52),
        paddingHorizontal: scale(6),
        gap: scale(12),
        shadowColor: '#0D483F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 3,
        width: "95%",
    },
    iconCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#D9F99D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: fs(18),
        fontWeight: '500',
        fontFamily: 'Aeonik-Medium',
    },
    arrowIcon: {
        marginRight: scale(10),
    },
    subtitle: {
        marginTop: vScale(10),
        textAlign: 'center',
        fontSize: fs(14),
        color: '#7A7A6E',
        fontFamily: 'Aeonik-Medium',
    },
    Container: {
        marginTop: vScale(20)
    }
})

export default UploadButtom