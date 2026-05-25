import { Call } from "@/service/call"

export const GetMedicineList = (token: string) => Call({
    method: "GET",
    path: "/medicine/Get",
    headers: {
        Authorization: `Bearer ${token}`,
    },
})