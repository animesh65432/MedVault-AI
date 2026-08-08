import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect } from "react"

type UserNameContextType = {
    userName: string
    OnChangeUserName: (name: string) => Promise<void>
}

const RECENT_SEARCHES_KEY = "UserName"

export const UserNameContext = createContext<UserNameContextType>({
    userName: "",
    OnChangeUserName: async (name: string) => { }
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

    const OnChangeUserName = async (name: string) => {
        setUserName(name)
        try {
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, name)
        } catch (e) {
            console.error("Failed to save user name", e)
        }
    }

    useEffect(() => {
        loadUserName()
    }, [])

    return (
        <UserNameContext.Provider value={{
            userName,
            OnChangeUserName
        }}>
            {children}
        </UserNameContext.Provider>
    )
}
