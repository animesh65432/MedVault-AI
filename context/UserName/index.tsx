import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect } from "react";

type UserNameContextType = {
    userName: string
    OnChangeUserName: (name: string) => Promise<void>;
    Created: Date | null;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    setCreated: React.Dispatch<React.SetStateAction<Date | null>>;
}

const RECENT_SEARCHES_KEY = "UserName"

export const UserNameContext = createContext<UserNameContextType>({
    userName: "",
    OnChangeUserName: async (name: string) => { },
    Created: null,
    setUserName: () => { },
    setCreated: () => { }
})

export const UserNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userName, setUserName] = React.useState<string>("")
    const [Created, setCreated] = React.useState<Date | null>(null)

    const loadUserName = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
            const storeDate = await AsyncStorage.getItem(`${RECENT_SEARCHES_KEY}_created`)
            if (stored) {
                setUserName(stored)
            }
            if (storeDate) {
                setCreated(new Date(storeDate))
            }
        } catch (e) {
            console.error("Failed to load user name", e)
        }
    }

    const OnChangeUserName = async (name: string) => {
        setUserName(name)
        setCreated(new Date())
        try {
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, name)
            await AsyncStorage.setItem(`${RECENT_SEARCHES_KEY}_created`, new Date().toISOString())
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
            OnChangeUserName,
            Created,
            setUserName,
            setCreated
        }}>
            {children}
        </UserNameContext.Provider>
    )
}
