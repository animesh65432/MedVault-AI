import { createContext } from "react"
import React from "react"

type OnboardingContextType = {
    IsonboardingComplete: boolean
    setOnboardingComplete: React.Dispatch<React.SetStateAction<boolean>>
}

export const OnboardingContext = createContext<OnboardingContextType>({
    IsonboardingComplete: false,
    setOnboardingComplete: () => { },
})


export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [IsonboardingComplete, setOnboardingComplete] = React.useState(false)
    return (
        <OnboardingContext.Provider value={{ IsonboardingComplete, setOnboardingComplete }}>
            {children}
        </OnboardingContext.Provider>
    )
}

