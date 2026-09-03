import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

type OnboardingContextType = {
    IsonboardingComplete: boolean
    setOnboardingCompleteAndCache: (status: boolean) => Promise<void>
    isHydrated: boolean
}

export const OnboardingContext = createContext<OnboardingContextType>({
    IsonboardingComplete: false,
    setOnboardingCompleteAndCache: () => Promise.resolve(),
    isHydrated: false
})


export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [IsonboardingComplete, setOnboardingComplete] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            const status = await AsyncStorage.getItem("isOnboardingComplete")
            setOnboardingComplete(status === "true")
            setIsHydrated(true);
        }
        checkOnboardingStatus()
    }, [])

    const setOnboardingCompleteAndCache = async (status: boolean) => {
        setOnboardingComplete(status)
        await AsyncStorage.setItem("isOnboardingComplete", status.toString())
    }

    return (
        <OnboardingContext.Provider value={{
            IsonboardingComplete,
            setOnboardingCompleteAndCache,
            isHydrated
        }}>
            {children}
        </OnboardingContext.Provider>
    )
}

