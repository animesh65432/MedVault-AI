import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from "react-native"
import { MedicalDocument } from "@/types"
import { GetDocs } from "@/api/docs"
import Title from './Title'
import Stats from './Stats'

const HomeLayOut = () => {
    const [documents, setDocuments] = useState<MedicalDocument[]>([]);

    const FetchDocuments = async () => {
        try {
            const response = await GetDocs("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIm5hbWUiOiJBbmltZXNoIiwicHJvZmlsZV9pbWFnZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UuanBnIiwiZXhwIjoxNzg3MDgzODkwfQ.GKBzZ3wo8Hd879SXpC8vwBhj2BEbEiHWXeWsjbMFD18") as MedicalDocument[];
            setDocuments(response);
        } catch (error) {
            console.log("Error fetching documents:", error);
        }
    }

    useEffect(() => {
        FetchDocuments();
    }, []);

    return (
        <View style={styles.container}>
            <Title userName="John Doe" />
            <Stats />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default HomeLayOut