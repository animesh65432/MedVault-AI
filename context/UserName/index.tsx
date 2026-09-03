import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect } from "react";

type UserNameContextType = {
    userName: string
    OnChangeUserName: (name: string) => Promise<void>;
    Created: Date | null;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    setCreated: React.Dispatch<React.SetStateAction<Date | null>>;
    profilePic: string | null;
    OnChangeProfilePic: (pic: string | null) => Promise<void>;
    isHydrated: boolean;
}

const RECENT_SEARCHES_KEY = "UserName"

export const UserNameContext = createContext<UserNameContextType>({
    userName: "",
    OnChangeUserName: async (name: string) => { },
    Created: null,
    setUserName: () => { },
    setCreated: () => { },
    profilePic: null,
    OnChangeProfilePic: async (pic: string | null) => { },
    isHydrated: false,
})

export const UserNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userName, setUserName] = React.useState<string>("")
    const [profilePic, setProfilePic] = React.useState<string | null>(null)
    const [Created, setCreated] = React.useState<Date | null>(null)
    const [isHydrated, setIsHydrated] = React.useState<boolean>(false)

    const loadUserName = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
            const storeDate = await AsyncStorage.getItem(`${RECENT_SEARCHES_KEY}_created`)
            const profilePicStored = await AsyncStorage.getItem(`${RECENT_SEARCHES_KEY}_profilePic`)
            if (stored) {
                setUserName(stored)
            }
            if (storeDate) {
                setCreated(new Date(storeDate))
            }
            if (profilePicStored) {
                setProfilePic(profilePicStored)
            }
        } catch (e) {
            console.error("Failed to load user name", e)
        }
        finally {
            setIsHydrated(true)
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

    const OnChangeProfilePic = async (pic: string | null) => {
        setProfilePic(pic)
        try {
            if (pic) {
                await AsyncStorage.setItem(`${RECENT_SEARCHES_KEY}_profilePic`, pic)
            } else {
                await AsyncStorage.removeItem(`${RECENT_SEARCHES_KEY}_profilePic`)
            }
        } catch (e) {
            console.error("Failed to save profile picture", e)
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
            setCreated,
            profilePic,
            OnChangeProfilePic,
            isHydrated
        }}>
            {children}
        </UserNameContext.Provider>
    )
}
