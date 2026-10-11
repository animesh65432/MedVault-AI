import { TypeOfDocumenet } from '@/types';
import { formatDate } from "@/utils/formatDate";
import { scale } from '@/utils/scale';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    searchQuery: string | null;
    startDate: string | null;
    endDate: string | null;
    SelectedCategoried: TypeOfDocumenet | null;
    setCategory: React.Dispatch<React.SetStateAction<TypeOfDocumenet | null>>;
    setDates: React.Dispatch<React.SetStateAction<{
        startDate: Date | null;
        endDate: Date | null;
    }>>;
    setInput: React.Dispatch<React.SetStateAction<string | null>>;
}

const Filter: React.FC<Props> = ({ setInput, setDates, setCategory, SelectedCategoried, searchQuery, startDate, endDate }) => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather
                    name="search"
                    size={scale(18)}
                    color="#23423B"
                    onPress={() => router.push({
                        pathname: "/SearchDocuments",
                        params: {
                            ShowResults: "false"
                        }
                    })}
                />
            </View>
            {
                searchQuery &&
                <TouchableOpacity
                    onPress={() => setInput("")}
                    style={styles.chip}
                >
                    <AntDesign
                        name="close"
                        size={scale(14)}
                        color="black"
                    />
                    <Text style={styles.chiptext}>
                        {searchQuery}
                    </Text>
                </TouchableOpacity>
            }

            {SelectedCategoried &&
                <TouchableOpacity
                    style={styles.chip}
                    onPress={() => setCategory(null)}
                >
                    <AntDesign
                        name="close"
                        size={scale(14)}
                        color="black"
                    />
                    <Text style={styles.chiptext}>
                        {SelectedCategoried}
                    </Text>
                </TouchableOpacity>
            }
            {startDate && endDate &&
                <TouchableOpacity
                    style={styles.chip}
                    onPress={() => setDates({
                        startDate: null,
                        endDate: null
                    })}
                >
                    <AntDesign
                        name="close"
                        size={scale(14)}
                        color="black"
                    />
                    <Text style={styles.chiptext}>
                        {formatDate(startDate)} - {formatDate(endDate)}
                    </Text>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: scale(10)
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
        minWidth: scale(250)
    },
    dropdownList: {
        borderRadius: scale(10),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
    },
    chip: {
        height: scale(35),
        paddingHorizontal: scale(10),
        borderWidth: 1,
        borderColor: "#23423B",
        borderRadius: scale(10),
        justifyContent: "center",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(5)
    },
    chiptext: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(14)
    },
});

export default Filter;