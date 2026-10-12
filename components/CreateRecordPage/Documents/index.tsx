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
        <View style={style.Container}>
            {
                documents.map((doc) => {
                    return <Document
                        doc={doc}
                        key={doc.Id}
                    />
                })
            }
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: scale(10),
        paddingHorizontal: scale(16),
        flexWrap: "wrap",
        marginBottom: scale(100),
        marginTop: scale(50)
    }
})

export default Documents