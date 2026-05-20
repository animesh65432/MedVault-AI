import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';
import React, { createContext, useEffect, useState } from "react";


GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    offlineAccess: true,
});

export const User = createContext({
    name: "",
    email: "",
    isLoggedIn: false,
    pofilepicture: "",
    token: "",
    IsLoading: false,
    SignOut: () => new Promise<void>(() => { }),
    SignIn: () => new Promise<void>(() => { }),
})

type Props = {
    children: React.ReactNode
}

type UserProfile = {
    name: string;
    email: string;
    isLoggedIn: boolean;
    pofilepicture: string;
    token: string;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>({
        name: "",
        email: "",
        isLoggedIn: false,
        pofilepicture: "",
        token: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const GetUserProfileFromCache = async () => {
        try {
            const cachedUser = await AsyncStorage.getItem("userProfile");
            if (cachedUser) {
                setUser(JSON.parse(cachedUser));
            }
        } catch (error) {
            console.error("Error fetching user profile from cache:", error);
        }
    }

    useEffect(() => {
        GetUserProfileFromCache();
    }, []);

    const SignIn = async () => {
        setIsLoading(true);
        try {
            console.log('🚀 Starting Google Sign In...');

            await GoogleSignin.hasPlayServices();

            const response = await GoogleSignin.signIn();

            console.log('Google Sign In Response:', response);

            if (isSuccessResponse(response)) {
                const { user } = response.data;

                console.log('✅ User Info:', user);

                // Create user profile
                const userProfile: UserProfile = {
                    name: user.name || "Guest",
                    email: user.email || "",
                    isLoggedIn: true,
                    pofilepicture: user.photo || "",
                    token: ""
                };

                // Send to your backend
                // const authresponse = await singinwithgoogle(
                //     userProfile.name,
                //     userProfile.email
                // ) as {
                //     token: string;
                //     message: string;
                // };

                // Save to AsyncStorage
                const completeProfile = {
                    ...userProfile,
                    token: "dummy_token_from_backend" // Replace with actual token from backend
                };

                await AsyncStorage.setItem("userProfile", JSON.stringify(completeProfile));


                setUser(completeProfile);

            } else {

            }

        } catch (error: any) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        console.log('User cancelled sign in');
                        break;

                    case statusCodes.IN_PROGRESS:
                        console.log('Sign in already in progress');
                        break;

                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.log('Play services not available');
                        break;
                    default:
                        console.log('Unknown error code:', error.code);

                }
            } else {
            }
        } finally {
            setIsLoading(false);
        }
    }

    const SignOut = async () => {
        try {
            // Sign out from Google
            await GoogleSignin.signOut();

            // Clear AsyncStorage
            await AsyncStorage.removeItem("userProfile");

            // Reset state
            setUser({
                name: "Guest",
                email: "",
                isLoggedIn: false,
                pofilepicture: "",
                token: "",
            });

        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    return (
        <User.Provider value={{
            ...user,
            IsLoading: isLoading,
            SignOut,
            SignIn,
        }}>
            {children}
        </User.Provider>
    )
}