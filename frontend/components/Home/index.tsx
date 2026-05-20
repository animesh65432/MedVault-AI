import React, { useEffect } from 'react'
import { View, Text } from "react-native"
import { GetDocs } from "@/api/docs"

const HomeLayOut = () => {

    const FetchDocuments = async () => {
        try {
            const response = await GetDocs("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIm5hbWUiOiJBbmltZXNoIiwicHJvZmlsZV9pbWFnZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UuanBnIiwiZXhwIjoxNzg3MDgzODkwfQ.GKBzZ3wo8Hd879SXpC8vwBhj2BEbEiHWXeWsjbMFD18");
            console.log("Documents fetched successfully:", response);
        } catch (error) {
            console.log("Error fetching documents:", error);
        }
    }

    useEffect(() => {
        FetchDocuments();
    }, []);

    return (
        <View>

        </View>
    )
}

export default HomeLayOut