import { TypeOfDocumenet } from "@/types";
import { TypesOfDocuments } from '@/utils/contensnt';
import { scale } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { selectedType } from "../index";

type DropdownItem = {
    label: string;
    value: TypeOfDocumenet;
};

type Props = {
    selected: selectedType;
    setSelected: React.Dispatch<React.SetStateAction<selectedType>>;
}

const Filter: React.FC<Props> = ({ selected, setSelected }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather
                    name="search"
                    size={scale(18)}
                    color="#23423B"
                />
            </View>
            <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownList}
                placeholderStyle={styles.text}
                selectedTextStyle={styles.text}
                itemTextStyle={styles.text}
                data={TypesOfDocuments}
                labelField="label"
                valueField="value"
                maxHeight={scale(250)}
                value={selected}
                onChange={(item: DropdownItem) => setSelected(item.value)}
            />

            <View style={styles.iconContainer}>
                <Feather
                    name="calendar"
                    size={scale(16)}
                    color="#1f2020"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: scale(10),
    },
    iconContainer: {
        width: scale(35),
        height: scale(35),
        borderWidth: 1,
        borderRadius: scale(10),
        justifyContent: "center",
        alignItems: "center",
        borderBlockColor: "#23423B"
    },
    dropdown: {
        height: scale(35),
        borderWidth: 1,
        borderColor: "black",
        borderRadius: scale(10),
        paddingHorizontal: scale(10),
        borderBlockColor: "#1f2020",
        minWidth: scale(250),
    },
    dropdownList: {
        borderRadius: scale(10),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
    },
});

export default Filter;