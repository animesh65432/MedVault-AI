import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Document from "./Document";

type Props = {
    documents: DocumentRow[]
}

const Documents: React.FC<Props> = ({
    documents
}) => {
    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.EmptyContainer}>
                    <AntDesign name="folder" size={scale(24)} color="#082e28" />
                    <Text style={styles.emptyText}>
                        No documents yet
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View
            style={[
                styles.container
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: scale(10),
        rowGap: vScale(10),
        justifyContent: "center"
    },
    emptyContainer: {
        paddingVertical: vScale(10),
        alignItems: "center",
        justifyContent: "center",
    },

    emptyText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "black"
    },
    EmptyContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(10),
        paddingTop: vScale(250)
    },
})

export default Documents