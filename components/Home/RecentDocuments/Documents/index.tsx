import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Document from "./Document"

type Props = {
    documents: DocumentRow[]
}

const Documents: React.FC<Props> = ({ documents }) => {
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