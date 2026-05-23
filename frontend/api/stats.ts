import { Call } from "@/service/call"

export const GetStats = async (token: string) => Call({
    path: "/api/v1/docs/stats",
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`
    }
})