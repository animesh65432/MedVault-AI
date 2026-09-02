import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import Document from "./Document"

type Props = {
    documents: DocumentRow[]
    IsHome?: boolean
}

const Documents: React.FC<Props> = ({
    documents,
    IsHome = false,
}) => {
    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    No documents yet
                </Text>
            </View>
        )
    }

    return (
        <View
            style={[
                styles.container,
                {
                    marginBottom: IsHome
                        ? vScale(20)
                        : vScale(100),
                },
            ]}
        >
            {documents.map((doc) => (
                <Document
                    key={doc.Id}
                    doc={doc}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: scale(12),
        rowGap: vScale(14),
    },
    emptyContainer: {
        paddingVertical: vScale(20),
        alignItems: "center",
        justifyContent: "center",
    },

    emptyText: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(14),
        color: "#5A7A74",
    },
})

export default Documents