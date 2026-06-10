import { Call } from "@/service/call"

export const singinwithgoogle = async (name: string, email: string, profile_image: string) => Call({
    method: "POST",
    path: "/users/login",
    request: {
        name,
        email,
        profile_image
    }
})

export const getUserProfile = async (token: string) => Call({
    method: "GET",
    path: "/users/me",
    request: {
        token
    }
})