import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { GenrateDoc } from "@/api/docs"
import { Toast } from "toastify-react-native";
// import { User } from "@/context/User";
import { token } from "@/utils/token"
import DocumentScaning from "@/components/DocumentScaning";
import { isLoading } from "expo-font";

const first = (val: string | string[]) => Array.isArray(val) ? val[0] : val;


const DocumentResult: React.FC = () => {
    // const { token } = useContext(User)
    const [IsLoading, setIsLoading] = useState(false);
    const { fileUri, fileName, fileType } = useLocalSearchParams();

    async function processDocument() {
        setIsLoading(true);
        try {
            if (!fileUri || !fileName || !fileType) {
                Toast.error('Missing file parameters');
                return;
            }

            const formData = new FormData();

            formData.append("file", {
                uri:
                    Platform.OS === "android"
                        ? (fileUri as string)
                        : (fileUri as string).replace("file://", ""),
                name: fileName as string,
                type: fileType as string,
            } as any);

            const response = await GenrateDoc(token, formData);

            console.log(response)

        }
        catch (error) {
            console.log('Error processing document:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        processDocument();
    }, [fileName, fileType, fileUri]);

    if (IsLoading) {
        return <DocumentScaning
            fileUri={first(fileUri)}
            fileName={first(fileName)}
            fileType={first(fileType)}
        />
    }

    return (
        <View style={styles.container}>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
})

export default DocumentResult;
