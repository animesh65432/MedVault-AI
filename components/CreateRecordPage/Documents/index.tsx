import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Document from "./Document"

type Props = {
    documents: DocumentRow[];
    SelectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
    SelectionMode: boolean
}

const Documents: React.FC<Props> = ({ SelectionMode, documents, SelectedIds, setSelectedIds }) => {
    return (
        <View style={style.Container}>
            {
                documents.map((doc) => {
                    return <Document
                        doc={doc}
                        key={doc.Id}
                        SelectedIds={SelectedIds}
                        setSelectedIds={setSelectedIds}
                        SelectionMode={SelectionMode}
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
        marginTop: scale(10)
    }
})

export default Documents