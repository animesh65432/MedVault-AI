import React from 'react'
import { View, Text } from "react-native"

type Props = {
    userName: string
}

const Title: React.FC<Props> = ({ userName }) => {
    return (
        <View>
            <Text>Hello, {userName}</Text>
        </View>
    )
}

export default Title