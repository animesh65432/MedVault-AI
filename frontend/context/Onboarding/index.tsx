import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext } from "react";

type OnboardingContextType = {
    IsonboardingComplete: boolean
    setOnboardingCompleteAndCache: (status: boolean) => Promise<void>
}

export const OnboardingContext = createContext<OnboardingContextType>({
    IsonboardingComplete: false,
    setOnboardingCompleteAndCache: () => Promise.resolve(),
})


export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [IsonboardingComplete, setOnboardingComplete] = React.useState(false)

    React.useEffect(() => {
        const checkOnboardingStatus = async () => {
            const status = await AsyncStorage.getItem("isOnboardingComplete")
            setOnboardingComplete(status === "true")
        }
        checkOnboardingStatus()
    }, [])

    const setOnboardingCompleteAndCache = async (status: boolean) => {
        setOnboardingComplete(status)
        await AsyncStorage.setItem("isOnboardingComplete", status.toString())
    }

    return (
        <OnboardingContext.Provider value={{ IsonboardingComplete, setOnboardingCompleteAndCache }}>
            {children}
        </OnboardingContext.Provider>
    )
}

