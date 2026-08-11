import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useEffect, useState } from 'react';

type NetworkContextType = {
    isOnline: boolean;
};

export const NetworkContext = createContext<NetworkContextType>({ isOnline: true });

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOnline(!!state.isConnected && state.isInternetReachable !== false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <NetworkContext.Provider value={{ isOnline }}>
            {children}
        </NetworkContext.Provider>
    );
};