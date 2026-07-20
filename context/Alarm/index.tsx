import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect, useState } from "react"

type AlarmContextType = {
    IsAlarmActive: boolean,
    OnChangeIsAlarmActive: (value: boolean) => void
}

export const AlarmContext = createContext<AlarmContextType>({
    IsAlarmActive: false,
    OnChangeIsAlarmActive: () => { }
})

type Props = {
    children: React.ReactNode
}

export const AlarmProvider: React.FC<Props> = ({ children }) => {
    const [IsAlarmActive, setIsAlarmActive] = useState(false);

    useEffect(() => {
        const checkIsAlarmActiveStatus = async () => {
            const status = await AsyncStorage.getItem("IsAlarmActive")
            setIsAlarmActive(status === "true")
        }
        checkIsAlarmActiveStatus()
    }, [])

    const OnChangeIsAlarmActive = async (status: boolean) => {
        setIsAlarmActive(status)
        await AsyncStorage.setItem("IsAlarmActive", status.toString())
    }

    return (
        <AlarmContext.Provider
            value={{
                IsAlarmActive,
                OnChangeIsAlarmActive
            }}
        >
            {children}
        </AlarmContext.Provider>
    )
}
