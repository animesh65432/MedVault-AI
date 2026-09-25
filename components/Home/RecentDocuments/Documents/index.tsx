import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Document from "./Document"
import OneDocument from "./OneDocument"

type Props = {
    documents: DocumentRow[]
}

const Documents: React.FC<Props> = ({ documents }) => {
    if (documents.length === 1) {
        return <OneDocument document={documents[0]} />
    }
    return (
        <View
            style={styles.container}
        >
            {
                documents.map((document) => (
                    <Document
                        key={document.Id}
                        document={document}
                    />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: scale(10)
    }
})


export default Documents