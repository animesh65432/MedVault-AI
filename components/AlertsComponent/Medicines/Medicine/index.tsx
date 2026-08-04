import React from 'react';
import { View } from 'react-native';

export type Medicine = {
    Id: number;
    name: string
}

type Props = {
    medicine: Medicine
}

const Medicine: React.FC<Props> = ({ medicine }) => {
    return (
        <View></View>
    )
}

export default Medicine