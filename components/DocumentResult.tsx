import { DocumentType } from "@/types"
import React from 'react'
import { Text, View } from "react-native"

type Props = {
    Document: DocumentType
}

const DocumentResult: React.FC<Props> = ({ Document }) => {
    return (
        <View>
            <Text>{Document.title}</Text>
        </View>
    )
}

export default DocumentResult