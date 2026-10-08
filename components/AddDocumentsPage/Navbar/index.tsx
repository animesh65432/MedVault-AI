import { DocumentRow } from '@/types';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavbarPhoto from './NavbarPhoto';

type Props = {
    SelectedDocuments: DocumentRow[]
}

const Navbar: React.FC<Props> = ({
    SelectedDocuments,
}) => {
    const router = useRouter()
    return (
        <View
            style={styles.NavbarContainer}
        >
            <View
                style={styles.CloseIcon}
            >
                <AntDesign
                    name="close"
                    size={scale(20)}
                    color="#1f2020"
                    onPress={() => router.back()}
                />

                {SelectedDocuments.length === 0 &&
                    <Text style={styles.text}>Add photos</Text>
                }
                <View style={styles.SelectedContainer}>
                    <View
                        style={styles.ImageContainer}
                    >
                        {
                            SelectedDocuments.length > 0 &&
                            <NavbarPhoto
                                document={SelectedDocuments[SelectedDocuments.length - 1]}
                            />
                        }
                    </View>

                    {SelectedDocuments.length > 0
                        &&
                        <Text style={styles.SelectedText}>
                            {SelectedDocuments.length} selected
                        </Text>
                    }
                </View>
            </View>
            {SelectedDocuments.length > 0 &&
                <TouchableOpacity>
                    <Text style={styles.AddButton}>Add</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    NavbarContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    CloseIcon: {
        marginTop: vScale(10),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(20)
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(22),
        color: "#1f2020"
    },
    SelectedText: {
        color: "#1f2020",
        fontFamily: "Aeonik-Medium",
        fontSize: scale(20),
    },
    SelectedContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(10)
    },
    ImageContainer: {
        width: scale(54),
        height: vScale(34),
    },
    AddButton: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "#1f2020"
    }
})

export default Navbar