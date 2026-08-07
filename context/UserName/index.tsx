import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect } from "react"

type UserNameContextType = {
    userName: string
    setUserName: React.Dispatch<React.SetStateAction<string>>
}

const RECENT_SEARCHES_KEY = "UserName"

export const UserNameContext = createContext<UserNameContextType>({
    userName: "",
    setUserName: () => { },
})

export const UserNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userName, setUserName] = React.useState<string>("")

    const loadUserName = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
            if (stored) {
                setUserName(stored)
            }
        } catch (e) {
            console.error("Failed to load user name", e)
        }
    }

    useEffect(() => {
        loadUserName()
    }, [])

    return (
        <UserNameContext.Provider value={{
            userName,
            setUserName
        }}>
            {children}
        </UserNameContext.Provider>
    )
}
