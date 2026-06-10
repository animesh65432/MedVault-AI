import { Call } from "@/service/call"

export const GetStats = async (token: string) => Call({
    path: "/docs/stats",
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`
    }
})