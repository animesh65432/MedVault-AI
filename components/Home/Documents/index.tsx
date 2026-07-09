import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'

type Props = {
    documents: DocumentRow[]
}

type IconLib = 'Fontisto' | 'Entypo' | 'FontAwesome5'

const TYPE_ICON: Record<DocumentRow['type'], { lib: IconLib; name: string }> = {
    "Prescription": { lib: 'FontAwesome5', name: 'pills' },
    "Prescription Receipt": { lib: 'FontAwesome5', name: 'receipt' },
    "Lab Report": { lib: 'Entypo', name: 'lab-flask' },
    "Radiology Report": { lib: 'Fontisto', name: 'file-1' },
    "Medical Bill": { lib: 'FontAwesome5', name: 'file-invoice-dollar' },
    "Discharge Summary": { lib: 'Fontisto', name: 'file-1' },
    "Referral Letter": { lib: 'Fontisto', name: 'email' },
    "Insurance Document": { lib: 'FontAwesome5', name: 'shield-alt' },
    "Consent Form": { lib: 'Fontisto', name: 'file-1' },
    "Medical History Record": { lib: 'Fontisto', name: 'file-1' },
    "Other": { lib: 'Fontisto', name: 'file-1' },
}

const DocIcon: React.FC<{ type: DocumentRow['type'] }> = ({ type }) => {
    const config = TYPE_ICON[type] ?? TYPE_ICON["Other"]
    const props = { name: config.name, size: scale(20), color: "#23423B" }

    if (config.lib === 'Entypo') return <Entypo {...props} />
    if (config.lib === 'FontAwesome5') return <FontAwesome5 {...props} />
    return <Fontisto {...props} />
}

const joinDefined = (parts: (string | null)[], sep = " • "): string => {
    return parts.filter((p): p is string => !!p && p.trim().length > 0).join(sep)
}

const getSubtitle = (doc: DocumentRow): string => {
    switch (doc.type) {
        case "Prescription":
            return joinDefined([doc.doctor_name, doc.clinic_name])
        case "Prescription Receipt":
            return doc.pharmacy_name ?? ""
        case "Lab Report":
            return doc.lab_name ?? ""
        case "Radiology Report":
            return doc.center_name ?? ""
        case "Medical Bill":
            return doc.hospital_name ?? ""
        case "Discharge Summary":
            return doc.hospital_name ?? ""
        case "Referral Letter":
            return joinDefined([doc.referring_doctor, doc.referred_to], " → ")
        default:
            return doc.summary ?? ""
    }
}

const getDate = (doc: DocumentRow): string | null => {
    return doc.date && doc.date.trim().length > 0 ? doc.date : null
}

const Documents: React.FC<Props> = ({ documents }) => {
    const router = useRouter()

    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No documents yet</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {documents.map((doc) => {
                const subtitle = getSubtitle(doc)
                return (
                    <TouchableOpacity
                        key={doc.Id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/document/${doc.Id}` as any)}
                    >
                        <View style={styles.iconWrapper}>
                            <DocIcon type={doc.type} />
                        </View>
                        <View style={styles.textWrapper}>
                            <Text style={styles.type}>{doc.type}</Text>
                            {getDate(doc) && (
                                <Text style={styles.date}>{getDate(doc)}</Text>
                            )}
                            {subtitle.length > 0 && (
                                <Text style={styles.subtitle} numberOfLines={1}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: vScale(12),
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(14),
        padding: scale(14),
        gap: scale(12),
    },
    iconWrapper: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(10),
        backgroundColor: "#EEF6A2",
        alignItems: "center",
        justifyContent: "center",
    },
    textWrapper: {
        flex: 1,
        gap: vScale(2),
    },
    type: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(14),
        color: "#23423B",
    },
    date: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(12),
        color: "#5A7A74",
    },
    subtitle: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(12),
        color: "#5A7A74",
    },
    emptyContainer: {
        paddingVertical: vScale(24),
        alignItems: "center",
    },
    emptyText: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(14),
        color: "#5A7A74",
    },
})

export default Documents